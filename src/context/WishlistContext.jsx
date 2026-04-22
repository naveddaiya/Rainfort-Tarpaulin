import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem('rainfort-wishlist');
    if (saved) {
      try {
        dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rainfort-wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const toggleItem = (product) => dispatch({ type: 'TOGGLE_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const isWishlisted = (id) => state.items.some(i => i.id === id);
  const clearWishlist = () => dispatch({ type: 'CLEAR' });

  return (
    <WishlistContext.Provider value={{ items: state.items, toggleItem, removeItem, isWishlisted, clearWishlist, totalItems: state.items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
