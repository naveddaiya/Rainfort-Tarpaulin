'use strict';

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// Change to 'us-central1' if asia-south1 is not available in your Firebase plan
const REGION = 'asia-south1';

// Secrets — set with:
//   firebase functions:secrets:set RAZORPAY_KEY_ID
//   firebase functions:secrets:set RAZORPAY_KEY_SECRET
//   firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
const RAZORPAY_KEY_ID       = defineSecret('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET   = defineSecret('RAZORPAY_KEY_SECRET');
const RAZORPAY_WEBHOOK_SECRET = defineSecret('RAZORPAY_WEBHOOK_SECRET');

// ─────────────────────────────────────────────────────────────────────────────
// 1. createRazorpayOrder
//    Called from frontend after createPendingOrder writes the Firestore doc.
//    Validates the amount against our stored total, creates a Razorpay order,
//    stores razorpay_order_id back on the Firestore doc, returns it to frontend.
// ─────────────────────────────────────────────────────────────────────────────
exports.createRazorpayOrder = onCall(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET], region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const { amount, firestoreOrderId } = request.data;
    if (!amount || amount <= 0)  throw new HttpsError('invalid-argument', 'Invalid amount');
    if (!firestoreOrderId)       throw new HttpsError('invalid-argument', 'firestoreOrderId required');

    const orderRef  = db.collection('orders').doc(firestoreOrderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found');

    const order = orderSnap.data();
    if (order.userId !== request.auth.uid)  throw new HttpsError('permission-denied', 'Access denied');
    if (order.status !== 'PENDING_PAYMENT') throw new HttpsError('failed-precondition', `Order status is ${order.status}`);

    // Verify frontend amount matches what we stored server-side (fraud prevention)
    const storedTotal = order.pricing?.grandTotal;
    if (!storedTotal || Math.round(amount * 100) !== Math.round(storedTotal * 100)) {
      throw new HttpsError('invalid-argument', 'Amount does not match stored order total');
    }

    const razorpay = new Razorpay({
      key_id:     RAZORPAY_KEY_ID.value(),
      key_secret: RAZORPAY_KEY_SECRET.value(),
    });

    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(storedTotal * 100), // use stored total, not frontend value
      currency: 'INR',
      receipt:  firestoreOrderId.slice(0, 40), // Razorpay receipt max 40 chars
    });

    // Persist the Razorpay order ID so the webhook can look up our order
    await orderRef.update({
      'payment.razorpay_order_id': rzpOrder.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { razorpayOrderId: rzpOrder.id };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. verifyAndConfirmPayment
//    Called from frontend after Razorpay checkout returns success.
//    Verifies HMAC-SHA256 signature, then atomically:
//      - confirms the order in Firestore
//      - decrements product stock
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyAndConfirmPayment = onCall(
  { secrets: [RAZORPAY_KEY_SECRET], region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, firestoreOrderId } = request.data;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !firestoreOrderId) {
      throw new HttpsError('invalid-argument', 'Missing payment fields');
    }

    // Razorpay signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET.value())
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) {
      throw new HttpsError('permission-denied', 'Payment signature verification failed');
    }

    const orderRef = db.collection('orders').doc(firestoreOrderId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(orderRef);
      if (!snap.exists) throw new HttpsError('not-found', 'Order not found');

      const order = snap.data();
      if (order.userId !== request.auth.uid) throw new HttpsError('permission-denied', 'Access denied');
      if (order.status === 'confirmed') return; // idempotent — already confirmed, do nothing

      // Decrement stock for each product that has the stock field set
      for (const item of order.items) {
        const productRef  = db.collection('products').doc(item.id);
        const productSnap = await tx.get(productRef);
        if (productSnap.exists) {
          const stock = productSnap.data().stock;
          if (stock != null) {
            tx.update(productRef, { stock: Math.max(0, stock - item.quantity) });
          }
        }
      }

      tx.update(orderRef, {
        status:                        'confirmed',
        'payment.razorpay_payment_id': razorpayPaymentId,
        'payment.razorpay_order_id':   razorpayOrderId,
        'payment.razorpay_signature':  razorpaySignature,
        'payment.status':              'paid',
        'payment.paidAt':              new Date().toISOString(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. razorpayWebhook
//    HTTPS endpoint — register in Razorpay Dashboard → Webhooks.
//    URL: https://<REGION>-<PROJECT_ID>.cloudfunctions.net/razorpayWebhook
//
//    Acts as a reliable fallback for payment.captured and payment.failed events.
//    Handles the case where the frontend verifyAndConfirmPayment call fails
//    mid-flight (network drop after payment, browser closed, etc).
// ─────────────────────────────────────────────────────────────────────────────
exports.razorpayWebhook = onRequest(
  { secrets: [RAZORPAY_WEBHOOK_SECRET], region: REGION },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const sig = req.headers['x-razorpay-signature'];
    if (!sig) {
      res.status(400).send('Missing X-Razorpay-Signature');
      return;
    }

    // Webhook signature = HMAC_SHA256(raw_body, webhook_secret)
    const expected = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET.value())
      .update(req.rawBody) // rawBody is a Buffer — correct for HMAC
      .digest('hex');

    if (expected !== sig) {
      res.status(400).send('Invalid signature');
      return;
    }

    const event   = req.body;
    const payment = event?.payload?.payment?.entity;

    // Acknowledge events we don't handle
    if (!payment?.order_id) {
      res.status(200).send('OK');
      return;
    }

    const rzpOrderId = payment.order_id;

    // Look up our Firestore order by the Razorpay order ID we stored earlier
    const query = await db
      .collection('orders')
      .where('payment.razorpay_order_id', '==', rzpOrderId)
      .limit(1)
      .get();

    if (query.empty) {
      res.status(200).send('OK');
      return;
    }

    const orderDoc = query.docs[0];
    const order    = orderDoc.data();

    if (event.event === 'payment.captured') {
      // Skip if already confirmed (idempotent)
      if (order.status === 'confirmed') {
        res.status(200).send('OK');
        return;
      }

      await db.runTransaction(async (tx) => {
        const fresh = await tx.get(orderDoc.ref);
        if (!fresh.exists || fresh.data().status === 'confirmed') return;

        for (const item of order.items) {
          const productRef  = db.collection('products').doc(item.id);
          const productSnap = await tx.get(productRef);
          if (productSnap.exists) {
            const stock = productSnap.data().stock;
            if (stock != null) {
              tx.update(productRef, { stock: Math.max(0, stock - item.quantity) });
            }
          }
        }

        tx.update(orderDoc.ref, {
          status:                        'confirmed',
          'payment.razorpay_payment_id': payment.id,
          'payment.status':              'paid',
          'payment.paidAt':              new Date().toISOString(),
          'payment.confirmedViaWebhook': true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

    } else if (event.event === 'payment.failed') {
      if (order.status === 'PENDING_PAYMENT') {
        await orderDoc.ref.update({
          status:                      'FAILED',
          'payment.status':            'failed',
          'payment.failedViaWebhook':  true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.status(200).send('OK');
  }
);
