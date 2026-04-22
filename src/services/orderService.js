import { sendEmail, sendOrderConfirmationEmail } from './emailService';
import { db } from '@/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Submit an order to Firebase Firestore
 */
export const submitOrder = async (orderData) => {
  try {

    const orderDoc = {
      userId: orderData.userId || null,
      customer: {
        name: orderData.name.trim(),
        phone: orderData.phone.trim(),
        email: orderData.email.trim(),
        company: orderData.company?.trim() || null,
      },
      shipping: {
        address: orderData.address.trim(),
        city: orderData.city.trim(),
        state: orderData.state,
        pincode: orderData.pincode.trim(),
      },
      notes: orderData.notes?.trim() || null,
      items: orderData.items.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        selectedSize: i.selectedSize || null,
        selectedGsm: i.selectedGsm || null,
        specifications: i.specifications || {},
      })),
      payment: orderData.payment || null,
      totalItems: orderData.items.reduce((s, i) => s + i.quantity, 0),
      status: 'pending',
      source: 'website',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
    };

    const docRef = await addDoc(collection(db, 'orders'), orderDoc);
    console.log('✅ Order submitted:', docRef.id);

    // Fire-and-forget emails — don't await, order is already saved
    const shortId = docRef.id.slice(0, 8).toUpperCase();
    const itemsList = orderData.items.map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n');

    // Notify admin
    sendEmail({
      to_name: 'RainFort Team',
      to_email: 'enquiry@rainfort.in',
      from_name: orderData.name,
      phone: orderData.phone,
      product: `Order #${shortId}`,
      message: `New Order!\n\nItems:\n${itemsList}\n\nShip to: ${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}\n\nNotes: ${orderData.notes || 'None'}`,
      type: 'New Order',
      reply_to: orderData.email,
      details: `Customer: ${orderData.name} | Phone: ${orderData.phone} | Email: ${orderData.email}`,
    }).catch(e => console.error('Admin email failed:', e?.text || e?.message || e));

    // Send confirmation email to customer
    sendOrderConfirmationEmail({
      customerName: orderData.name,
      customerEmail: orderData.email,
      orderId: shortId,
      items: orderData.items,
      shipping: { address: orderData.address, city: orderData.city, state: orderData.state, pincode: orderData.pincode },
    }).catch(e => console.error('Customer confirmation email failed:', e?.text || e?.message || e));

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Order submission failed:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Firebase permission denied. Go to Firebase Console → Firestore → Rules and allow writes to the orders collection.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase is unavailable. Check your internet connection and try again.');
    }
    throw new Error(error.message || 'Failed to place order');
  }
};