import { Truck, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductShipping } from '../../models/product';

interface ShippingReturnsProps {
  shipping?: ProductShipping;
  returns?: string;
}

export default function ShippingReturns({ shipping, returns }: ShippingReturnsProps) {
  if (!shipping && !returns) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {shipping && (
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  {shipping.info || 'Standard shipping available'}
                </p>
                {shipping.estimatedDays && (
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: {shipping.estimatedDays}
                  </p>
                )}
              </div>
            </div>
          )}

          {shipping && returns && <Separator />}

          {returns && (
            <div className="flex items-start space-x-3">
              <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Returns</h4>
                <p className="text-sm text-muted-foreground">{returns}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
