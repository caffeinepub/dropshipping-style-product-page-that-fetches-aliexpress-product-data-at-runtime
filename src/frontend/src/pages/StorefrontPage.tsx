import { STOREFRONT_PRODUCTS } from '../config/storefrontProducts';
import ProductDetailSection from '../components/product/ProductDetailSection';
import { Separator } from '@/components/ui/separator';

export default function StorefrontPage() {
  return (
    <div className="container py-8">
      <div className="space-y-16">
        {STOREFRONT_PRODUCTS.map((productConfig, index) => (
          <div key={productConfig.url + index}>
            <ProductDetailSection
              url={productConfig.url}
              displayName={productConfig.displayName}
              priceOverride={productConfig.priceOverride}
            />
            {index < STOREFRONT_PRODUCTS.length - 1 && (
              <Separator className="mt-16" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
