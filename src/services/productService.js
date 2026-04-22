/**
 * productService.js — Firestore CRUD for products.
 * Images are stored as URLs (no Firebase Storage required).
 */

import {
  db,
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, serverTimestamp,
} from '@/config/firebase';

const PRODUCTS_COL = 'products';

/** Fetch all admin-added products from Firestore, sorted by creation date. */
export const getFirestoreProducts = async () => {
  // No orderBy — avoids requiring a Firestore composite index.
  // We sort client-side after fetching.
  const snap = await getDocs(collection(db, PRODUCTS_COL));
  const docs = snap.docs.map(d => ({ ...d.data(), id: d.id, _source: 'firestore' }));
  // Newest first
  docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  return docs;
};

/**
 * Add a new product to Firestore.
 * @param {object} productData - all product fields including image URL
 */
export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, PRODUCTS_COL), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update an existing Firestore product.
 * @param {string} id - Firestore doc ID
 * @param {object} updates - fields to update
 */
export const updateProduct = async (id, updates) => {
  await updateDoc(doc(db, PRODUCTS_COL, id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a Firestore product.
 * @param {string} id - Firestore doc ID
 */
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
};
