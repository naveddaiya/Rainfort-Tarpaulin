/**
 * Razorpay Integration
 *
 * Flow (Phase 2 — server-side order + signature verification):
 *   1. Backend Cloud Function creates a Razorpay order → returns razorpayOrderId
 *   2. Frontend opens Razorpay modal with that order ID + amount
 *   3. On success, frontend receives payment_id + order_id + signature
 *   4. Backend Cloud Function verifies signature and confirms the order
 */

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout with a server-created order ID.
 *
 * @param {object} opts
 * @param {number}   opts.amount           - Order total in ₹ (shown to user, must match server order)
 * @param {string}   opts.razorpayOrderId  - Order ID from createRazorpayOrder Cloud Function
 * @param {string}   opts.customerName
 * @param {string}   opts.customerEmail
 * @param {string}   opts.customerPhone
 * @param {function} opts.onSuccess        - called with { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 * @param {function} opts.onFailure        - called with error message string
 */
export const openTokenPayment = async ({
  amount,
  razorpayOrderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure('Failed to load payment gateway. Please check your internet connection.');
    return;
  }
  if (!RAZORPAY_KEY) {
    onFailure('Razorpay key not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.');
    return;
  }

  const options = {
    key:      RAZORPAY_KEY,
    amount:   Math.round(amount * 100), // ₹ to paise (display only — server amount is authoritative)
    currency: 'INR',
    name:     'RainFort Tarpaulin',
    description: 'Order Payment',
    image:    '/rainfort-logo.png',
    order_id: razorpayOrderId, // server-created order ID — enables signature verification
    prefill: {
      name:    customerName  || '',
      email:   customerEmail || '',
      contact: customerPhone || '',
    },
    theme: { color: '#ff6b00' },
    modal: {
      ondismiss: () => onFailure('Payment cancelled'),
    },
    handler: (response) => {
      // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      onSuccess(response);
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (response) => {
    onFailure(response.error?.description || 'Payment failed. Please try again.');
  });
  rzp.open();
};
