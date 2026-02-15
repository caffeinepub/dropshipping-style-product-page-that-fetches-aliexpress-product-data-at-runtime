export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariantOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  available?: boolean;
  imageUrl?: string;
}

export interface ProductReview {
  rating: number;
  count: number;
  averageRating?: number;
}

export interface ProductShipping {
  info?: string;
  estimatedDays?: string;
  cost?: string;
}

export interface ProductModel {
  id: string;
  title: string;
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: string;
  images: ProductImage[];
  description: string;
  variants?: ProductVariantOption[];
  variantsList?: ProductVariant[];
  reviews?: ProductReview;
  shipping?: ProductShipping;
  returns?: string;
  specifications?: Record<string, string>;
}
