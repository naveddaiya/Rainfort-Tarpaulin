import emailjs from '@emailjs/browser';

// EmailJS Configuration
// You need to create an account at https://emailjs.com/
// and get these values from your dashboard
const EMAILJS_SERVICE_ID = "service_lw0dar9";
const EMAILJS_TEMPLATE_ID = "template_fhxo59f";
const EMAILJS_PUBLIC_KEY = "I--ZG8kDW5qyFimL7";

/**
 * Send email using EmailJS
 * @param {Object} templateParams - The parameters to pass to the email template
 * @returns {Promise} - The EmailJS response
 */
export const sendEmail = async (templateParams) => {
    try {
        if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
            console.warn("⚠️ EmailJS not configured. Please set your Service ID, Template ID, and Public Key in src/services/emailService.js");
            return;
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log('📧 Email sent successfully!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};

/**
 * Format quote data for email
 */
export const sendQuoteEmail = async (quoteData) => {
    const templateParams = {
        to_name: "Admin", // or your name
        from_name: quoteData.name,
        from_email: "website@rainfort.com", // Valid sender if needed
        phone: quoteData.phone,
        product: quoteData.product,
        message: `New Quote Request for ${quoteData.product}`,
        type: "Quote Request",
        reply_to: "", // Can map if you have user email in quote (we only have phone for quotes)
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
