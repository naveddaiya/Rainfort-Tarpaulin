import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Submit a quote request to Firebase Firestore
 * @param {Object} quoteData - The quote request data
 * @param {string} quoteData.name - Customer name
 * @param {string} quoteData.phone - Customer phone number
 * @param {string} quoteData.requirement - Customer requirements
 * @param {string|null} quoteData.product - Product name (optional)
 * @returns {Promise<Object>} - Returns the created document reference
 */
export const submitQuote = async (quoteData) => {
  try {
    // Validate required fields
    if (!quoteData.name || !quoteData.phone || !quoteData.requirement) {
      throw new Error('Missing required fields: name, phone, and requirement are required');
    }

    // Prepare the data to be stored
    const quoteSubmission = {
      name: quoteData.name.trim(),
      phone: quoteData.phone.trim(),
      requirement: quoteData.requirement.trim(),
      product: quoteData.product || 'General Inquiry',
      status: 'new', // new, contacted, quoted, completed, cancelled
      source: 'website',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Additional metadata
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      currentUrl: window.location.href
    };

    // Add document to 'quotes' collection
    const docRef = await addDoc(collection(db, 'quotes'), quoteSubmission);

    console.log('✅ Quote submitted successfully with ID:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      message: 'Quote request submitted successfully'
    };
  } catch (error) {
    console.error('❌ Error submitting quote:', error);

    // Handle specific Firebase errors
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
 * Get all quotes from Firebase (for admin use)
 * @param {number} limit - Maximum number of quotes to retrieve
 * @returns {Promise<Array>} - Array of quote documents
 */
export const getAllQuotes = async (limit = 50) => {
  try {
    const quotesRef = collection(db, 'quotes');
    const q = query(quotesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const quotes = [];
    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return quotes.slice(0, limit);
  } catch (error) {
    console.error('❌ Error fetching quotes:', error);
    throw new Error('Failed to fetch quotes');
  }
};

/**
 * Get quote statistics (for admin dashboard)
 * @returns {Promise<Object>} - Quote statistics
 */
export const getQuoteStats = async () => {
  try {
    const quotes = await getAllQuotes();

    return {
      total: quotes.length,
      new: quotes.filter(q => q.status === 'new').length,
      contacted: quotes.filter(q => q.status === 'contacted').length,
      quoted: quotes.filter(q => q.status === 'quoted').length,
      completed: quotes.filter(q => q.status === 'completed').length
    };
  } catch (error) {
    console.error('❌ Error fetching quote stats:', error);
    throw new Error('Failed to fetch quote statistics');
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

    // Prepare the data to be stored
    const contactSubmission = {
      name: contactData.name.trim(),
      email: contactData.email.trim(),
      phone: contactData.phone.trim(),
      company: contactData.company?.trim() || '',
      message: contactData.message.trim(),
      status: 'new', // new, read, replied, resolved
      source: 'website-contact',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Additional metadata
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      currentUrl: window.location.href
    };

    // Add document to 'contacts' collection
    const docRef = await addDoc(collection(db, 'contacts'), contactSubmission);

    console.log('✅ Contact message submitted successfully with ID:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      message: 'Contact message submitted successfully'
    };
  } catch (error) {
    console.error('❌ Error submitting contact message:', error);

    // Handle specific Firebase errors
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
