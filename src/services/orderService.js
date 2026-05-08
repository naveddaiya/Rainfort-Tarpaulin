import { sendEmail, sendOrderConfirmationEmail } from './emailService';
import { db } from '@/config/firebase';
import { collection, doc, addDoc, updateDoc, serverTimestamp } from '@/config/firebase';

/**
 * Create an order in Firestore BEFORE payment with status PENDING_PAYMENT.
 * Returns { id } — the Firestore doc ID used as the order reference throughout
 * the payment flow and passed to the Cloud Functions.
 */
export const createPendingOrder = async (orderData) => {
  const orderDoc = {
    userId: orderData.userId || null,
    customer: {
      name:    orderData.name.trim(),
      phone:   orderData.phone.trim(),
      email:   orderData.email.trim(),
      company: orderData.company?.trim() || null,
    },
    shipping: {
      address: orderData.address.trim(),
      city:    orderData.city.trim(),
      state:   orderData.state,
      pincode: orderData.pincode.trim(),
    },
    notes: orderData.notes?.trim() || null,
    items: orderData.items.map(i => ({
      id:           i.id,
      name:         i.name,
      category:     i.category,
      quantity:     i.quantity,
      selectedSize: i.selectedSize || null,
      selectedGsm:  i.selectedGsm  || null,
      unitPrice:    i.price || 0,
      lineTotal:    (i.price || 0) * i.quantity,
      specifications: i.specifications || {},
    })),
    pricing: {
      subtotal:        orderData.pricing.subtotal,
      gstAmount:       orderData.pricing.gstAmount,
      gstRate:         0.12,
      shippingCharges: orderData.pricing.shippingCharges,
      grandTotal:      orderData.pricing.grandTotal,
    },
    payment: {
      status: 'pending',
      amount: orderData.pricing.grandTotal,
    },
    totalItems: orderData.items.reduce((s, i) => s + i.quantity, 0),
    status:    'PENDING_PAYMENT',
    source:    'website',
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
    userAgent:  navigator.userAgent,
    referrer:   document.referrer || 'direct',
  };

  const docRef = await addDoc(collection(db, 'orders'), orderDoc);
  return { id: docRef.id };
};

/**
 * Mark an order as FAILED after a payment failure or cancellation.
 * Called from the frontend onFailure callback before the CF can do it.
 */
export const failOrder = async (orderId) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status:           'FAILED',
      'payment.status': 'failed',
      updatedAt:        serverTimestamp(),
    });
  } catch (e) {
    console.error('failOrder update failed:', e);
  }
};

/**
 * Send confirmation emails after the CF has verified and confirmed the order.
 * Called from the frontend so we can use EmailJS (browser-only SDK).
 */
export const sendConfirmationEmails = ({ orderId, customer, shipping, items, pricing }) => {
  const shortId   = orderId.slice(0, 8).toUpperCase();
  const itemsList = items.map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n');

  sendEmail({
    to_name:   'RainFort Team',
    to_email:  'enquiry@rainfort.in',
    from_name: customer.name,
    phone:     customer.phone,
    product:   `Order #${shortId}`,
    message:   `New Order!\n\nItems:\n${itemsList}\n\nShip to: ${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}\n\nTotal: ₹${pricing.grandTotal}\n\nNotes: ${customer.notes || 'None'}`,
    type:      'New Order',
    reply_to:  customer.email,
    details:   `Customer: ${customer.name} | Phone: ${customer.phone} | Email: ${customer.email}`,
  }).catch(e => console.error('Admin email failed:', e?.text || e?.message || e));

  sendOrderConfirmationEmail({
    customerName:  customer.name,
    customerEmail: customer.email,
    orderId:       shortId,
    items,
    shipping,
  }).catch(e => console.error('Customer email failed:', e?.text || e?.message || e));
};

/**
 * Legacy helper kept for any non-payment order paths (e.g. quote → order).
 */
export const submitOrder = async (orderData) => {
  try {
    const orderDoc = {
      userId: orderData.userId || null,
      customer: {
        name:    orderData.name.trim(),
        phone:   orderData.phone.trim(),
        email:   orderData.email.trim(),
        company: orderData.company?.trim() || null,
      },
      shipping: {
        address: orderData.address.trim(),
        city:    orderData.city.trim(),
        state:   orderData.state,
        pincode: orderData.pincode.trim(),
      },
      notes: orderData.notes?.trim() || null,
      items: orderData.items.map(i => ({
        id:           i.id,
        name:         i.name,
        category:     i.category,
        quantity:     i.quantity,
        selectedSize: i.selectedSize || null,
        selectedGsm:  i.selectedGsm  || null,
        unitPrice:    i.price || 0,
        lineTotal:    (i.price || 0) * i.quantity,
        specifications: i.specifications || {},
      })),
      payment:    orderData.payment || null,
      totalItems: orderData.items.reduce((s, i) => s + i.quantity, 0),
      status:     'pending',
      source:     'website',
      createdAt:  serverTimestamp(),
      updatedAt:  serverTimestamp(),
      userAgent:  navigator.userAgent,
      referrer:   document.referrer || 'direct',
    };

    const docRef    = await addDoc(collection(db, 'orders'), orderDoc);
    const shortId   = docRef.id.slice(0, 8).toUpperCase();
    const itemsList = orderData.items.map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n');

    sendEmail({
      to_name:   'RainFort Team',
      to_email:  'enquiry@rainfort.in',
      from_name: orderData.name,
      phone:     orderData.phone,
      product:   `Order #${shortId}`,
      message:   `New Order!\n\nItems:\n${itemsList}\n\nShip to: ${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}\n\nNotes: ${orderData.notes || 'None'}`,
      type:      'New Order',
      reply_to:  orderData.email,
      details:   `Customer: ${orderData.name} | Phone: ${orderData.phone} | Email: ${orderData.email}`,
    }).catch(e => console.error('Admin email failed:', e?.text || e?.message || e));

    sendOrderConfirmationEmail({
      customerName:  orderData.name,
      customerEmail: orderData.email,
      orderId:       shortId,
      items:         orderData.items,
      shipping:      { address: orderData.address, city: orderData.city, state: orderData.state, pincode: orderData.pincode },
    }).catch(e => console.error('Customer email failed:', e?.text || e?.message || e));

    return { success: true, id: docRef.id };
  } catch (error) {
    if (error.code === 'permission-denied') {
      throw new Error('Firebase permission denied. Check Firestore Rules for the orders collection.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase is unavailable. Check your internet connection and try again.');
    }
    throw new Error(error.message || 'Failed to place order');
  }
};
