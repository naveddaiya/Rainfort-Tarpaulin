// EmailJS Configuration - library lazy-loaded on first use
const EMAILJS_SERVICE_ID = "service_lw0dar9";
const EMAILJS_TEMPLATE_ID = "template_fhxo59f";
const EMAILJS_PUBLIC_KEY = "I--ZG8kDW5qyFimL7";

/**
 * Send email using EmailJS (lazy-loaded to keep initial bundle small)
 */
export const sendEmail = async (templateParams) => {
    try {
        const { default: emailjs } = await import('@emailjs/browser');

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

/**
 * Format quote data for email
 */
export const sendQuoteEmail = async (quoteData) => {
    const templateParams = {
        to_name: "Admin",
        to_email: "enquiry@rainfort.in",
        from_name: quoteData.name,
        from_email: quoteData.name,
        phone: quoteData.phone,
        product: quoteData.product,
        message: `New Quote Request for ${quoteData.product}`,
        type: "Quote Request",
        reply_to: "enquiry@rainfort.in",
        details: `
      Name: ${quoteData.name}
      Phone: ${quoteData.phone}
      Product: ${quoteData.product}
      Time: ${new Date().toLocaleString()}
    `
    };

    return sendEmail(templateParams);
};

/**
 * Send order status update email to customer
 */
export const sendOrderStatusEmail = async ({ customerName, customerEmail, orderId, newStatus, items }) => {
    const statusMessages = {
        confirmed: 'Your order has been confirmed! Our team is preparing it.',
        shipped: 'Your order has been shipped! It is on its way to you.',
        delivered: 'Your order has been delivered! Thank you for shopping with RainFort.',
        cancelled: 'Your order has been cancelled. Contact us if you have questions.',
    };

    const itemsList = (items || []).map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n');
    const message = statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`;

    const templateParams = {
        to_name: customerName,
        from_name: 'RainFort Tarpaulin',
        phone: '+91 83850 11488',
        product: `Order #${orderId}`,
        message: `${message}\n\nOrder Items:\n${itemsList}\n\nFor any queries, reach us on WhatsApp: +91 83850 11488`,
        type: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        reply_to: customerEmail || 'enquiry@rainfort.in',
        details: `Customer: ${customerName} | Status: ${newStatus.toUpperCase()}`,
    };

    return sendEmail(templateParams);
};

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmationEmail = async ({ customerName, customerEmail, orderId, items, shipping }) => {
    const itemsList = (items || []).map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n');
    const shippingAddr = shipping ? `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}` : 'N/A';

    const templateParams = {
        to_name: customerName,
        to_email: customerEmail,
        from_name: 'RainFort Tarpaulin',
        phone: '+91 83850 11488',
        product: `Order #${orderId}`,
        message: `Thank you for your order!\n\nOrder Items:\n${itemsList}\n\nShipping to: ${shippingAddr}\n\nOur team will call you within 2 hours to confirm pricing and delivery details.\n\nTrack your order at: rainfort.in/orders`,
        type: 'Order Confirmation',
        reply_to: customerEmail || 'enquiry@rainfort.in',
        details: `Customer: ${customerName} | Order: #${orderId}`,
    };

    return sendEmail(templateParams);
};

/**
 * Format contact message for email
 */
export const sendContactEmail = async (contactData) => {
    const templateParams = {
        to_name: "Admin",
        to_email: "enquiry@rainfort.in",
        from_name: contactData.name,
        from_email: contactData.email,
        phone: contactData.phone,
        product: contactData.company || "N/A",
        message: contactData.message,
        type: "Contact Message",
        reply_to: contactData.email,
        details: `
      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Company: ${contactData.company || 'N/A'}
      Message: ${contactData.message}
      Time: ${new Date().toLocaleString()}
    `
    };

    return sendEmail(templateParams);
};
