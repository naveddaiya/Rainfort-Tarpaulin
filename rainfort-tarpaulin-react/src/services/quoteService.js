import { sendQuoteEmail, sendContactEmail } from './emailService';

/**
 * Submit a quote request to Firebase Firestore
 * @param {Object} quoteData - The quote request data
 * @param {string} quoteData.name - Customer name
 * @param {string} quoteData.phone - Customer phone number
 * @param {string} quoteData.product - Selected product
 * @returns {Promise<Object>} - Returns the created document reference
 */
export const submitQuote = async (quoteData) => {
  try {
    // Validate required fields
    if (!quoteData.name || !quoteData.phone || !quoteData.product) {
      throw new Error('Missing required fields: name, phone, and product are required');
    }

    // Lazy load Firebase - only loads when user submits form
    const { getDb } = await import('@/config/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const db = await getDb();

    // Prepare the data to be stored
    const quoteSubmission = {
      name: quoteData.name.trim(),
      phone: quoteData.phone.trim(),
      product: quoteData.product.trim(),
      status: 'new',
      source: 'website',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      currentUrl: window.location.href
    };

    // Add document to 'quotes' collection
    const docRef = await addDoc(collection(db, 'quotes'), quoteSubmission);

    console.log('✅ Quote submitted successfully with ID:', docRef.id);

    // Send Email Notification
    sendQuoteEmail(quoteData).catch(err => console.error('Email failed:', err));

    return {
      success: true,
      id: docRef.id,
      message: 'Quote request submitted successfully'
    };
  } catch (error) {
    console.error('❌ Error submitting quote:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firebase security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase service is currently unavailable. Please try again later.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('Authentication required. Please check your Firebase configuration.');
    }
    throw new Error(error.message || 'Failed to submit quote request');
  }
};

/**
 * Submit a contact message to Firebase Firestore
 * @param {Object} contactData - The contact message data
 * @param {string} contactData.name - Customer name
 * @param {string} contactData.email - Customer email
 * @param {string} contactData.phone - Customer phone number
 * @param {string} contactData.company - Company name (optional)
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} - Returns the created document reference
 */
export const submitContactMessage = async (contactData) => {
  try {
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.message) {
      throw new Error('Missing required fields: name, email, phone, and message are required');
    }

    // Lazy load Firebase - only loads when user submits form
    const { getDb } = await import('@/config/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const db = await getDb();

    // Prepare the data to be stored
    const contactSubmission = {
      name: contactData.name.trim(),
      email: contactData.email.trim(),
      phone: contactData.phone.trim(),
      company: contactData.company?.trim() || '',
      message: contactData.message.trim(),
      status: 'new',
      source: 'website-contact',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      currentUrl: window.location.href
    };

    // Add document to 'contacts' collection
    const docRef = await addDoc(collection(db, 'contacts'), contactSubmission);

    console.log('✅ Contact message submitted successfully with ID:', docRef.id);

    // Send Email Notification
    sendContactEmail(contactData).catch(err => console.error('Email failed:', err));

    return {
      success: true,
      id: docRef.id,
      message: 'Contact message submitted successfully'
    };
  } catch (error) {
    console.error('❌ Error submitting contact message:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firebase security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase service is currently unavailable. Please try again later.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('Authentication required. Please check your Firebase configuration.');
    }
    throw new Error(error.message || 'Failed to submit contact message');
  }
};
