/**
 * RainFort Payment Worker — Cloudflare Workers
 *
 * Endpoints:
 *   POST /createRazorpayOrder       — create server-side Razorpay order
 *   POST /verifyAndConfirmPayment   — verify signature + confirm order + decrement stock
 *   POST /razorpayWebhook           — Razorpay event webhook (payment.captured / payment.failed)
 *
 * Secrets (set with `wrangler secret put <NAME>`):
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
 *   FIREBASE_WEB_API_KEY, FIREBASE_SERVICE_ACCOUNT
 *
 * Vars (in wrangler.toml):
 *   FIREBASE_PROJECT_ID
 */

// ─────────────────────────────────────────────────────────────────────────────
// Response helpers
// ─────────────────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age':       '86400',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

const fail = (msg, status = 400) => json({ error: msg }, status);

const GST_RATE = 0.12;
const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_CHARGE = 150;
const MAX_ORDER_ITEMS = 50;
const MAX_QTY_PER_LINE = 999;

const asString = (value, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const isPositiveNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

// ─────────────────────────────────────────────────────────────────────────────
// Firestore value ↔ JS conversion
// ─────────────────────────────────────────────────────────────────────────────

function toFsValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val))     return { arrayValue: { values: val.map(toFsValue) } };
  if (typeof val === 'object') return { mapValue: { fields: toFsFields(val) } };
  return { stringValue: String(val) };
}

function toFsFields(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toFsValue(v)]));
}

function fromFsValue(v) {
  if ('nullValue'      in v) return null;
  if ('booleanValue'   in v) return v.booleanValue;
  if ('integerValue'   in v) return parseInt(v.integerValue, 10);
  if ('doubleValue'    in v) return v.doubleValue;
  if ('stringValue'    in v) return v.stringValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue'     in v) return (v.arrayValue.values || []).map(fromFsValue);
  if ('mapValue'       in v) return fromFsFields(v.mapValue.fields || {});
  return null;
}

function fromFsFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromFsValue(v)]));
}

/**
 * Build a Firestore Write for a partial update.
 * dotUpdates: { 'status': 'confirmed', 'payment.status': 'paid', ... }
 * Produces the correct nested `fields` + `updateMask` so only the listed
 * paths are touched — all other existing fields are preserved.
 */
function buildWrite(docName, dotUpdates) {
  const fieldPaths = Object.keys(dotUpdates);
  const fields = {};

  for (const [dotPath, value] of Object.entries(dotUpdates)) {
    const parts = dotPath.split('.');
    let node = fields;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) node[parts[i]] = { mapValue: { fields: {} } };
      node = node[parts[i]].mapValue.fields;
    }
    node[parts[parts.length - 1]] = toFsValue(value);
  }

  return {
    update:     { name: docName, fields },
    updateMask: { fieldPaths },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Firestore REST helpers
// ─────────────────────────────────────────────────────────────────────────────

const FS  = (proj) => `https://firestore.googleapis.com/v1/projects/${proj}/databases/(default)/documents`;
const DOC = (proj, col, id) => `projects/${proj}/databases/(default)/documents/${col}/${id}`;

async function fsGet(proj, token, col, docId) {
  const res = await fetch(`${FS(proj)}/${col}/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  const doc = await res.json();
  if (doc.error) throw new Error(`fsGet: ${doc.error.message}`);
  return { name: doc.name, data: fromFsFields(doc.fields || {}) };
}

async function fsPatch(proj, token, col, docId, dotUpdates) {
  const docName = DOC(proj, col, docId);
  const write   = buildWrite(docName, dotUpdates);
  const url     = new URL(`https://firestore.googleapis.com/v1/${docName}`);
  for (const fp of write.updateMask.fieldPaths) url.searchParams.append('updateMask.fieldPaths', fp);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: docName, fields: write.update.fields }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`fsPatch: ${data.error.message}`);
  return data;
}

async function fsCreate(proj, token, col, data) {
  const res = await fetch(`${FS(proj)}/${col}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFsFields(data) }),
  });
  const doc = await res.json();
  if (doc.error) throw new Error(`fsCreate: ${doc.error.message}`);
  return { id: doc.name.split('/').pop(), name: doc.name, data: fromFsFields(doc.fields || {}) };
}

async function fsQuery(proj, token, col, fieldPath, value) {
  const res = await fetch(`${FS(proj)}:runQuery`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from:  [{ collectionId: col }],
        where: { fieldFilter: { field: { fieldPath }, op: 'EQUAL', value: toFsValue(value) } },
        limit: 1,
      },
    }),
  });
  const results = await res.json();
  if (!Array.isArray(results)) return [];
  return results
    .filter(r => r.document)
    .map(r => ({ name: r.document.name, data: fromFsFields(r.document.fields || {}) }));
}

async function fsBeginTransaction(proj, token) {
  const res = await fetch(`${FS(proj)}:beginTransaction`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ options: { readWrite: {} } }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`beginTransaction: ${data.error.message}`);
  return data.transaction;
}

async function fsGetInTx(proj, token, col, docId, tx) {
  const url = new URL(`${FS(proj)}/${col}/${docId}`);
  url.searchParams.set('transaction', tx);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) return null;
  const doc = await res.json();
  if (doc.error) throw new Error(`fsGetInTx: ${doc.error.message}`);
  return { name: doc.name, data: fromFsFields(doc.fields || {}) };
}

async function fsCommit(proj, token, tx, writes) {
  const res = await fetch(`${FS(proj)}:commit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction: tx, writes }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`commit: ${data.error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Service account → Google OAuth2 access token
// Cached per warm isolate (max ~1 hour lifetime per Worker instance).
// ─────────────────────────────────────────────────────────────────────────────

let _cachedToken  = null;
let _tokenExpiry  = 0;

async function getAccessToken(env) {
  const now = Date.now();
  if (_cachedToken && now < _tokenExpiry - 60_000) return _cachedToken;

  const sa    = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const token = await generateSAToken(sa.client_email, sa.private_key);
  _cachedToken = token;
  _tokenExpiry = now + 3_600_000;
  return token;
}

async function generateSAToken(clientEmail, privateKeyPem) {
  const now     = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss:   clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const key = await importPrivateKey(privateKeyPem);
  const sig  = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${b64url(sig)}`;

  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`SA token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function importPrivateKey(pem) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '');
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

function b64url(data) {
  const b64 = typeof data === 'string'
    ? btoa(data)
    : btoa(String.fromCharCode(...new Uint8Array(data)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Auth — verify user ID token via REST
// ─────────────────────────────────────────────────────────────────────────────

async function verifyFirebaseToken(idToken, webApiKey) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${webApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  );
  const data = await res.json();
  if (!res.ok || data.error || !data.users?.[0]) {
    throw new Error('Invalid or expired token');
  }
  return data.users[0].localId; // Firebase UID
}

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay REST + HMAC
// ─────────────────────────────────────────────────────────────────────────────

async function createRzpOrder(keyId, keySecret, amountPaise, receipt) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization:  `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Razorpay: ${data.error?.description || JSON.stringify(data)}`);
  }
  return data;
}

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function buildServerOrder(proj, token, userId, body) {
  const customer = body.customer || {};
  const shipping = body.shipping || {};
  const requestedItems = Array.isArray(body.items) ? body.items : [];

  if (!requestedItems.length || requestedItems.length > MAX_ORDER_ITEMS) {
    throw new Error('Invalid order items');
  }

  const cleanCustomer = {
    name:    asString(customer.name, 120),
    phone:   asString(customer.phone, 30),
    email:   asString(customer.email, 180),
    company: asString(customer.company, 180) || null,
  };
  const cleanShipping = {
    address: asString(shipping.address, 500),
    city:    asString(shipping.city, 120),
    state:   asString(shipping.state, 120),
    pincode: asString(shipping.pincode, 20),
  };

  if (!cleanCustomer.name || !cleanCustomer.phone || !cleanCustomer.email) {
    throw new Error('Missing customer details');
  }
  if (!cleanShipping.address || !cleanShipping.city || !cleanShipping.state || !cleanShipping.pincode) {
    throw new Error('Missing shipping details');
  }

  const items = [];
  for (const requested of requestedItems) {
    const id = asString(requested.id, 120);
    const quantity = Math.trunc(Number(requested.quantity));
    if (!id || !Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QTY_PER_LINE) {
      throw new Error('Invalid item quantity');
    }

    const productDoc = await fsGet(proj, token, 'products', id);
    if (!productDoc) {
      throw new Error('One or more cart items are not available for online payment');
    }

    const product = productDoc.data;
    if (!isPositiveNumber(product.price)) {
      throw new Error('One or more cart items do not have a valid server price');
    }
    if (product.stock != null && quantity > Number(product.stock)) {
      throw new Error(`${product.name || 'Product'} is out of stock`);
    }

    const unitPrice = Number(product.price);
    items.push({
      id,
      name:         asString(product.name, 180),
      category:     asString(product.category, 120),
      quantity,
      selectedSize: asString(requested.selectedSize, 120) || null,
      selectedGsm:  asString(requested.selectedGsm, 120) || null,
      unitPrice,
      lineTotal:    unitPrice * quantity,
      specifications: product.specifications || {},
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const gstAmount = Math.round(subtotal * GST_RATE);
  const shippingCharges = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const grandTotal = subtotal + gstAmount + shippingCharges;
  const now = new Date().toISOString();

  return {
    userId,
    customer: cleanCustomer,
    shipping: cleanShipping,
    notes: asString(body.notes, 1000) || null,
    items,
    pricing: { subtotal, gstAmount, gstRate: GST_RATE, shippingCharges, grandTotal },
    payment: { status: 'pending', amount: grandTotal },
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    status: 'PENDING_PAYMENT',
    source: 'website',
    createdAt: now,
    updatedAt: now,
    userAgent: asString(body.userAgent, 300),
    referrer: asString(body.referrer, 500) || 'direct',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared: run a transaction that confirms an order + decrements stock
// ─────────────────────────────────────────────────────────────────────────────

async function txConfirmOrder(proj, token, docId, orderItems, paymentUpdates) {
  const tx = await fsBeginTransaction(proj, token);

  const fresh = await fsGetInTx(proj, token, 'orders', docId, tx);
  if (!fresh) throw new Error('Order not found in transaction');
  if (fresh.data.status === 'confirmed') {
    await fsCommit(proj, token, tx, []); // idempotent
    return;
  }

  const writes = [];

  for (const item of orderItems) {
    const prod = await fsGetInTx(proj, token, 'products', item.id, tx);
    if (prod && prod.data.stock != null) {
      writes.push(buildWrite(DOC(proj, 'products', item.id), {
        stock: Math.max(0, prod.data.stock - item.quantity),
      }));
    }
  }

  writes.push(buildWrite(DOC(proj, 'orders', docId), paymentUpdates));

  await fsCommit(proj, token, tx, writes);
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: POST /createRazorpayOrder
// ─────────────────────────────────────────────────────────────────────────────

async function handleCreateRazorpayOrder(request, env) {
  const idToken = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!idToken) return fail('Missing auth token', 401);

  let userId;
  try   { userId = await verifyFirebaseToken(idToken, env.FIREBASE_WEB_API_KEY); }
  catch { return fail('Invalid auth token', 401); }

  const body = await request.json().catch(() => ({}));
  const token = await getAccessToken(env);
  const proj  = env.FIREBASE_PROJECT_ID;

  let orderDoc;
  try {
    const serverOrder = await buildServerOrder(proj, token, userId, body);
    orderDoc = await fsCreate(proj, token, 'orders', serverOrder);
  } catch (e) {
    return fail(e.message || 'Invalid order', 400);
  }

  // Server-side amount validation — frontend value must match what we stored
  const stored = orderDoc.data.pricing?.grandTotal;
  if (!stored || stored <= 0) return fail('Order total must be greater than zero', 400);

  const rzp = await createRzpOrder(
    env.RAZORPAY_KEY_ID,
    env.RAZORPAY_KEY_SECRET,
    Math.round(stored * 100),
    orderDoc.id.slice(0, 40),
  );

  await fsPatch(proj, token, 'orders', orderDoc.id, {
    'payment.razorpay_order_id': rzp.id,
    updatedAt: new Date().toISOString(),
  });

  return json({
    firestoreOrderId: orderDoc.id,
    razorpayOrderId: rzp.id,
    pricing: orderDoc.data.pricing,
    items: orderDoc.data.items,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: POST /verifyAndConfirmPayment
// ─────────────────────────────────────────────────────────────────────────────

async function handleVerifyAndConfirmPayment(request, env) {
  const idToken = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!idToken) return fail('Missing auth token', 401);

  let userId;
  try   { userId = await verifyFirebaseToken(idToken, env.FIREBASE_WEB_API_KEY); }
  catch { return fail('Invalid auth token', 401); }

  const body = await request.json().catch(() => ({}));
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, firestoreOrderId } = body;
  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !firestoreOrderId) {
    return fail('Missing payment fields');
  }

  // Razorpay signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
  const expected = await hmacHex(env.RAZORPAY_KEY_SECRET, `${razorpayOrderId}|${razorpayPaymentId}`);
  if (expected !== razorpaySignature) return fail('Signature verification failed', 403);

  const token = await getAccessToken(env);
  const proj  = env.FIREBASE_PROJECT_ID;

  // Quick ownership check before starting the transaction
  const orderDoc = await fsGet(proj, token, 'orders', firestoreOrderId);
  if (!orderDoc)                       return fail('Order not found', 404);
  if (orderDoc.data.userId !== userId) return fail('Access denied', 403);
  if (orderDoc.data.status !== 'PENDING_PAYMENT' && orderDoc.data.status !== 'confirmed') {
    return fail(`Order status: ${orderDoc.data.status}`, 409);
  }
  if (orderDoc.data.payment?.razorpay_order_id !== razorpayOrderId) {
    return fail('Payment order mismatch', 403);
  }

  const now = new Date().toISOString();

  await txConfirmOrder(proj, token, firestoreOrderId, orderDoc.data.items || [], {
    status:                        'confirmed',
    'payment.razorpay_payment_id': razorpayPaymentId,
    'payment.razorpay_order_id':   razorpayOrderId,
    'payment.razorpay_signature':  razorpaySignature,
    'payment.status':              'paid',
    'payment.paidAt':              now,
    updatedAt:                     now,
  });

  return json({ success: true });
}

async function handleFailOrder(request, env) {
  const idToken = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!idToken) return fail('Missing auth token', 401);

  let userId;
  try   { userId = await verifyFirebaseToken(idToken, env.FIREBASE_WEB_API_KEY); }
  catch { return fail('Invalid auth token', 401); }

  const body = await request.json().catch(() => ({}));
  const firestoreOrderId = asString(body.firestoreOrderId, 120);
  if (!firestoreOrderId) return fail('firestoreOrderId required');

  const token = await getAccessToken(env);
  const proj  = env.FIREBASE_PROJECT_ID;
  const orderDoc = await fsGet(proj, token, 'orders', firestoreOrderId);
  if (!orderDoc)                       return fail('Order not found', 404);
  if (orderDoc.data.userId !== userId) return fail('Access denied', 403);
  if (orderDoc.data.status !== 'PENDING_PAYMENT') return json({ success: true });

  await fsPatch(proj, token, 'orders', firestoreOrderId, {
    status: 'FAILED',
    'payment.status': 'failed',
    updatedAt: new Date().toISOString(),
  });

  return json({ success: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: POST /razorpayWebhook
// Registered in: Razorpay Dashboard → Webhooks
// URL: https://rainfort-payments.<your-subdomain>.workers.dev/razorpayWebhook
// ─────────────────────────────────────────────────────────────────────────────

async function handleRazorpayWebhook(request, env) {
  const sig     = request.headers.get('x-razorpay-signature');
  const rawBody = await request.text(); // must read raw before parsing

  if (!sig) return new Response('Missing signature', { status: 400 });

  const expected = await hmacHex(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
  if (expected !== sig) return new Response('Invalid signature', { status: 400 });

  const event   = JSON.parse(rawBody);
  const payment = event?.payload?.payment?.entity;
  if (!payment?.order_id) return new Response('OK', { status: 200 });

  const token = await getAccessToken(env);
  const proj  = env.FIREBASE_PROJECT_ID;
  const now   = new Date().toISOString();

  const docs = await fsQuery(proj, token, 'orders', 'payment.razorpay_order_id', payment.order_id);
  if (!docs.length) return new Response('OK', { status: 200 });

  const { name, data: order } = docs[0];
  const docId = name.split('/').pop();

  if (event.event === 'payment.captured') {
    if (order.status !== 'confirmed') {
      await txConfirmOrder(proj, token, docId, order.items || [], {
        status:                        'confirmed',
        'payment.razorpay_payment_id': payment.id,
        'payment.status':              'paid',
        'payment.paidAt':              now,
        'payment.confirmedViaWebhook': true,
        updatedAt:                     now,
      });
    }

  } else if (event.event === 'payment.failed') {
    if (order.status === 'PENDING_PAYMENT') {
      await fsPatch(proj, token, 'orders', docId, {
        status:                     'FAILED',
        'payment.status':           'failed',
        'payment.failedViaWebhook': true,
        updatedAt:                  now,
      });
    }
  }

  return new Response('OK', { status: 200 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    try {
      if (pathname === '/createRazorpayOrder')     return await handleCreateRazorpayOrder(request, env);
      if (pathname === '/verifyAndConfirmPayment') return await handleVerifyAndConfirmPayment(request, env);
      if (pathname === '/failOrder')               return await handleFailOrder(request, env);
      if (pathname === '/razorpayWebhook')         return await handleRazorpayWebhook(request, env);
      return new Response('Not Found', { status: 404 });
    } catch (e) {
      console.error(e);
      return fail(e.message || 'Internal server error', 500);
    }
  },
};
