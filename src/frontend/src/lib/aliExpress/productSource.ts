export const ALIEXPRESS_PRODUCT_URL = 'https://www.aliexpress.com/item/1005006574626248.html';

export async function fetchProductFromBackend(actor: any, url?: string): Promise<string> {
  if (!actor) {
    throw new Error('Actor not initialized');
  }
  
  // Use provided URL or fall back to default
  const productUrl = url || ALIEXPRESS_PRODUCT_URL;
  
  return await actor.fetchAliExpressProduct(productUrl);
}
