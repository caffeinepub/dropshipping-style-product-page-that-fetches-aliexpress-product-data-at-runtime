import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItemSnapshot } from './cartTypes';
import { loadCart, saveCart, clearCart as clearCartStorage } from './cartStorage';

interface CartContextValue {
  items: CartItemSnapshot[];
  addItem: (item: CartItemSnapshot) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemSnapshot[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const loaded = loadCart();
    setItems(loaded);
    setIsInitialized(true);
  }, []);

  // Save cart whenever items change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCart(items);
    }
  }, [items, isInitialized]);

  const addItem = useCallback((newItem: CartItemSnapshot) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...current, newItem];
      }
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    setItems((current) =>
      current.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
