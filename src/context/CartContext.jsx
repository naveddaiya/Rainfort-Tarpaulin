import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

/**
 * Generates a unique key per cart entry.
 * Same product + same variant = one row (qty increments).
 * Same product + different variant = separate rows.
 */
const makeCartKey = (item) => {
  if (item.selectedSize || item.selectedGsm) {
    return `${item.id}__${item.selectedSize || ''}__${item.selectedGsm || ''}`;
  }
  return String(item.id);
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = makeCartKey(action.payload);
      const existing = state.items.find(i => i.cartKey === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.cartKey === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartKey: key, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartKey !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.cartKey !== action.payload.cartKey) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cartKey === action.payload.cartKey ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      // Backfill cartKey for items saved before this change
      return {
        ...state,
        items: action.payload.map(i => ({ ...i, cartKey: i.cartKey || makeCartKey(i) })),
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem('rainfort-cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rainfort-cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  const addItem    = (product) => dispatch({ type: 'ADD_ITEM',    payload: product });
  const removeItem = (cartKey) => dispatch({ type: 'REMOVE_ITEM', payload: cartKey });
  const updateQty  = (cartKey, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartKey, qty } });
  const clearCart  = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
