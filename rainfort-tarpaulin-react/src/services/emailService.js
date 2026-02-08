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
