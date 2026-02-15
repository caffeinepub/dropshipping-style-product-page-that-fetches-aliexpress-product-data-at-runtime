import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useFetchProduct } from '../hooks/useQueries';
import { useCart } from '../cart/useCart';
import { ALIEXPRESS_PRODUCT_URL } from '../lib/aliExpress/productSource';
import { deriveProductIdFromUrl } from '../lib/aliExpress/productIdentity';
import ImageGallery from '../components/product/ImageGallery';
import ProductDescription from '../components/product/ProductDescription';
import ReviewsSection from '../components/product/ReviewsSection';
import ShippingReturns from '../components/product/ShippingReturns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductPage() {
  const { data: product, isLoading, isError, error, refetch } = useFetchProduct();
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    
    const stableProductId = deriveProductIdFromUrl(ALIEXPRESS_PRODUCT_URL);
    
    addItem({
      productId: stableProductId,
      variantId: 'default',
      quantity,
      title: product.title,
      price: product.price,
      currency: product.currency,
      imageUrl: product.images[0]?.url,
    });

    setTimeout(() => {
      setIsAdding(false);
      toast.success('Added to cart', {
        description: `${quantity} item(s) added to your cart`,
        action: {
          label: 'View Cart',
          onClick: () => router.navigate({ to: '/cart' }),
        },
      });
    }, 300);
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0 && num <= 99) {
      setQuantity(num);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Failed to load product data. The product page may be unavailable or blocked.
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div>
          <ImageGallery images={product.images} />
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <ReviewsSection reviews={product.reviews} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold">
                {product.currency === 'USD' ? '$' : product.currency}
                {product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.currency === 'USD' ? '$' : product.currency}
                    {product.originalPrice.toFixed(2)}
                  </span>
                  {product.discount && (
                    <Badge variant="destructive" className="text-sm">
                      {product.discount}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Add to Cart Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      disabled={quantity >= 99}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ShippingReturns shipping={product.shipping} returns={product.returns} />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-12">
        <ProductDescription
          description={product.description}
          specifications={product.specifications}
        />
      </div>
    </div>
  );
}
