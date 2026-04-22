/**
 * useProducts — merges static catalog with admin-added Firestore products.
 *
 * Strategy:
 *   - Static products are available INSTANTLY (no loading state).
 *   - Firestore products are fetched in the background with a 6 s timeout.
 *   - If Firestore is unreachable (offline / slow network), the page still
 *     shows the full static catalog without any spinner or delay.
 *   - When Firestore responds, admin-added products are merged in seamlessly.
 */

import { useState, useEffect, useCallback } from 'react';
import { products as staticProducts } from '@/data/products';
import { getFirestoreProducts } from '@/services/productService';

// Normalised static catalog — string IDs, source tag
const BASE_PRODUCTS = staticProducts.map(p => ({
  ...p,
  id: String(p.id),
  _source: 'static',
}));

const FETCH_TIMEOUT_MS = 6000;

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore request timed out')), ms)
    ),
  ]);

export const useProducts = () => {
  // Start with static products immediately — no loading flash
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [fsLoading, setFsLoading] = useState(true);  // background fetch in progress
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setFsLoading(true);
    setError(null);
    try {
      const docs = await withTimeout(getFirestoreProducts(), FETCH_TIMEOUT_MS);
      setFirestoreProducts(docs);
    } catch (err) {
      console.error('useProducts: Firestore fetch failed:', err?.code, err?.message);
      setError(err.message || 'Failed to load products');
      setFirestoreProducts([]);
    } finally {
      setFsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const products = [...BASE_PRODUCTS, ...firestoreProducts];

  return {
    products,
    loading: false,      // never block the UI — static products are always ready
    fsLoading,           // true while background fetch is in progress
    error,
    refetch: fetch,
  };
};
