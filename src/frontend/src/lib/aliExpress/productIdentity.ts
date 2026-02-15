// Generate stable product identifiers from AliExpress URLs for cart management
export function deriveProductIdFromUrl(url: string): string {
  try {
    // Extract the item ID from the AliExpress URL
    const match = url.match(/\/item\/(\d+)\.html/);
    if (match && match[1]) {
      return `aliexpress-${match[1]}`;
    }
    
    // Fallback: use a simple hash of the URL
    return `product-${simpleHash(url)}`;
  } catch (error) {
    console.error('Error deriving product ID:', error);
    return `product-${simpleHash(url)}`;
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export function normalizeAliExpressUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Keep only the essential parts for consistency
    return `${urlObj.origin}${urlObj.pathname}`;
  } catch (error) {
    return url;
  }
}
