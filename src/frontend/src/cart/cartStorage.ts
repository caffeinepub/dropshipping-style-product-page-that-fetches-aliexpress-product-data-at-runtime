import { CartState, CartItemSnapshot } from './cartTypes';

const CART_STORAGE_KEY = 'dropshipping_cart';
const CART_VERSION = 1;

export function loadCart(): CartItemSnapshot[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed: CartState = JSON.parse(stored);
    
    // Version check
    if (parsed.version !== CART_VERSION) {
      console.warn('Cart version mismatch, clearing cart');
      clearCart();
      return [];
    }
    
    return parsed.items || [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

export function saveCart(items: CartItemSnapshot[]): void {
  try {
    const state: CartState = {
      items,
      version: CART_VERSION,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export function clearCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}
