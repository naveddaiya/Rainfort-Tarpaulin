/**
 * Cloudflare Worker client — wraps the three payment endpoints.
 * Set VITE_WORKER_URL in .env to your deployed Worker URL, e.g.:
 *   VITE_WORKER_URL=https://rainfort-payments.YOUR_SUBDOMAIN.workers.dev
 *
 * For local dev run `wrangler dev` in workers/ and set:
 *   VITE_WORKER_URL=http://localhost:8787
 */

const BASE = import.meta.env.VITE_WORKER_URL || '';

async function post(path, body, idToken) {
  if (!BASE) throw new Error('VITE_WORKER_URL is not set');

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  if (!res.ok) throw new Error(data.error || `Worker error ${res.status}`);
  return data;
}

/**
 * Step 1 of checkout: create the Firestore order and Razorpay order server-side.
 * Returns { firestoreOrderId, razorpayOrderId, pricing, items }
 */
export const createRazorpayOrder = (orderPayload, idToken) =>
  post('/createRazorpayOrder', orderPayload, idToken);

/**
 * Step 4 of checkout: verify signature + confirm order + decrement stock.
 * Returns { success: true }
 */
export const verifyAndConfirmPayment = (razorpayPaymentId, razorpayOrderId, razorpaySignature, firestoreOrderId, idToken) =>
  post('/verifyAndConfirmPayment', { razorpayPaymentId, razorpayOrderId, razorpaySignature, firestoreOrderId }, idToken);

export const failOrder = (firestoreOrderId, idToken) =>
  post('/failOrder', { firestoreOrderId }, idToken);
