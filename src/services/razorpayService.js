/**
 * Razorpay Integration — Token Advance Payment
 *
 * Flow:
 *   1. Customer places order (Firebase) → gets an orderId
 *   2. We open Razorpay for a ₹499 advance / booking token
 *   3. On success we store paymentId + mark order as "advance_paid"
 *
 * Setup:
 *   - Add VITE_RAZORPAY_KEY_ID=rzp_live_xxxx to your .env
 *   - Razorpay script is loaded lazily (no impact on initial page load)
 */

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

/** Dynamically load the Razorpay checkout script once */
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
 * Open Razorpay checkout for a booking token (₹499).
 *
 * @param {object} opts
 * @param {string} opts.orderId      - Firebase order document ID (short 8-char shown to user)
 * @param {string} opts.customerName
 * @param {string} opts.customerEmail
 * @param {string} opts.customerPhone
 * @param {function} opts.onSuccess  - called with { razorpay_payment_id, ... }
 * @param {function} opts.onFailure  - called with error message string
 */
export const openTokenPayment = async ({ orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
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
    key: RAZORPAY_KEY,
    amount: 49900,          // ₹499 in paise
    currency: 'INR',
    name: 'RainFort Tarpaulin',
    description: `Booking Token — Order #${orderId}`,
    image: '/rainfort-logo.png',
    order_id: undefined,    // Leave undefined for direct payment (no server-side order needed for token)
    prefill: {
      name:    customerName  || '',
      email:   customerEmail || '',
      contact: customerPhone || '',
    },
    notes: {
      firebase_order_id: orderId,
      type: 'booking_token',
    },
    theme: {
      color: '#ff6b00',
    },
    modal: {
      ondismiss: () => onFailure('Payment cancelled'),
    },
    handler: (response) => {
      // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
      onSuccess(response);
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (response) => {
    onFailure(response.error?.description || 'Payment failed. Please try again.');
  });
  rzp.open();
};
