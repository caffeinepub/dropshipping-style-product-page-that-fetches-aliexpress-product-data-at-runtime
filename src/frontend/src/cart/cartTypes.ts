export interface CartItemSnapshot {
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

export interface CartState {
  items: CartItemSnapshot[];
  version: number;
}
