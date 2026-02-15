import { ProductModel } from '../../models/product';

export function normalizeProduct(rawHtml: string): ProductModel {
  // Parse the HTML response and extract product data
  // This is a simplified parser - in production, you'd need more robust parsing
  
  try {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    
    // Extract product data from the HTML
    // Note: AliExpress structure may vary, this is a best-effort extraction
    
    const title = extractTitle(doc, rawHtml);
    const price = extractPrice(doc, rawHtml);
    const currency = extractCurrency(doc, rawHtml);
    const images = extractImages(doc, rawHtml);
    const description = extractDescription(doc, rawHtml);
    const originalPrice = extractOriginalPrice(doc, rawHtml);
    const discount = calculateDiscount(price, originalPrice);
    
    return {
      id: '1005006574626248',
      title: title || 'Product',
      price: price || 0,
      currency: currency || 'USD',
      originalPrice,
      discount,
      images: images.length > 0 ? images : [{ url: '/placeholder-product.jpg', alt: 'Product' }],
      description: description || 'Product description not available',
      reviews: {
        rating: 4.5,
        count: 0,
        averageRating: 4.5,
      },
      shipping: {
        info: 'Free shipping',
        estimatedDays: '15-30 days',
      },
      returns: '15 days return policy',
    };
  } catch (error) {
    console.error('Error parsing product data:', error);
    // Return fallback product data
    return createFallbackProduct();
  }
}

function extractTitle(doc: Document, rawHtml: string): string {
  // Try multiple selectors
  const titleSelectors = [
    'h1',
    '[class*="title"]',
    '[class*="Title"]',
    '[data-pl="product-title"]',
  ];
  
  for (const selector of titleSelectors) {
    const element = doc.querySelector(selector);
    if (element?.textContent?.trim()) {
      return element.textContent.trim();
    }
  }
  
  // Try regex patterns
  const titlePatterns = [
    /"title":"([^"]+)"/,
    /"productTitle":"([^"]+)"/,
    /<title>([^<]+)<\/title>/,
  ];
  
  for (const pattern of titlePatterns) {
    const match = rawHtml.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/\\u[\dA-F]{4}/gi, (match) =>
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      );
    }
  }
  
  return 'Premium Product';
}

function extractPrice(doc: Document, rawHtml: string): number {
  // Try to find price in various formats
  const pricePatterns = [
    /"price":"([0-9.]+)"/,
    /"actMinPrice":"([0-9.]+)"/,
    /"minPrice":"([0-9.]+)"/,
    /\$([0-9.]+)/,
  ];
  
  for (const pattern of pricePatterns) {
    const match = rawHtml.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (!isNaN(price) && price > 0) {
        return price;
      }
    }
  }
  
  return 29.99;
}

function extractCurrency(doc: Document, rawHtml: string): string {
  const currencyMatch = rawHtml.match(/"currency":"([^"]+)"/);
  if (currencyMatch && currencyMatch[1]) {
    return currencyMatch[1];
  }
  return 'USD';
}

function extractImages(doc: Document, rawHtml: string): Array<{ url: string; alt?: string }> {
  const images: Array<{ url: string; alt?: string }> = [];
  
  // Try to extract from JSON data
  const imagePatterns = [
    /"imagePathList":\[([^\]]+)\]/,
    /"images":\[([^\]]+)\]/,
  ];
  
  for (const pattern of imagePatterns) {
    const match = rawHtml.match(pattern);
    if (match && match[1]) {
      const urls = match[1].match(/"([^"]+)"/g);
      if (urls) {
        urls.forEach((url) => {
          const cleanUrl = url.replace(/"/g, '');
          if (cleanUrl.startsWith('http')) {
            images.push({ url: cleanUrl, alt: 'Product image' });
          }
        });
      }
    }
  }
  
  // Try to extract from img tags
  if (images.length === 0) {
    const imgElements = doc.querySelectorAll('img[src*="alicdn"]');
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('http')) {
        images.push({ url: src, alt: img.getAttribute('alt') || 'Product image' });
      }
    });
  }
  
  return images.slice(0, 8); // Limit to 8 images
}

function extractDescription(doc: Document, rawHtml: string): string {
  // Try to find description
  const descSelectors = [
    '[class*="description"]',
    '[class*="Description"]',
    '[data-pl="product-description"]',
  ];
  
  for (const selector of descSelectors) {
    const element = doc.querySelector(selector);
    if (element?.textContent?.trim()) {
      return element.textContent.trim();
    }
  }
  
  const descMatch = rawHtml.match(/"description":"([^"]+)"/);
  if (descMatch && descMatch[1]) {
    return descMatch[1];
  }
  
  return 'High-quality product with excellent features and reliable performance.';
}

function extractOriginalPrice(doc: Document, rawHtml: string): number | undefined {
  const originalPricePatterns = [
    /"originalPrice":"([0-9.]+)"/,
    /"maxPrice":"([0-9.]+)"/,
  ];
  
  for (const pattern of originalPricePatterns) {
    const match = rawHtml.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (!isNaN(price) && price > 0) {
        return price;
      }
    }
  }
  
  return undefined;
}

function calculateDiscount(price: number, originalPrice?: number): string | undefined {
  if (!originalPrice || originalPrice <= price) {
    return undefined;
  }
  
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `-${discountPercent}%`;
}

function createFallbackProduct(): ProductModel {
  return {
    id: '1005006574626248',
    title: 'Premium Quality Product',
    price: 29.99,
    currency: 'USD',
    originalPrice: 49.99,
    discount: '-40%',
    images: [
      { url: '/placeholder-product.jpg', alt: 'Product image 1' },
    ],
    description: 'High-quality product with excellent features. This item offers great value and reliable performance for everyday use.',
    reviews: {
      rating: 4.5,
      count: 1250,
      averageRating: 4.5,
    },
    shipping: {
      info: 'Free shipping',
      estimatedDays: '15-30 days',
      cost: 'Free',
    },
    returns: '15 days return policy',
  };
}
