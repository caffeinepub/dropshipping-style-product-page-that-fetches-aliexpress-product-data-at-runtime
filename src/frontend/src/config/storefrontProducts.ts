// Configuration for products displayed on the storefront
export interface StorefrontProductConfig {
  url: string;
  displayName?: string;
  priceOverride?: number; // Override price in USD
}

export const STOREFRONT_PRODUCTS: StorefrontProductConfig[] = [
  {
    url: 'https://www.aliexpress.com/item/1005006574626248.html',
    displayName: 'Premium Product',
  },
  {
    url: 'https://www.aliexpress.com/item/1005006574626248.html',
    displayName: 'LED Lighting Strip',
    priceOverride: 160.00,
  },
];
