import { useState, useEffect, useCallback } from 'react';
import { getFirestoreProducts } from '@/services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await getFirestoreProducts();
      setProducts(docs);
    } catch (err) {
      console.error('useProducts: Firestore fetch failed:', err?.code, err?.message);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, fsLoading: loading, error, refetch: fetch };
};
