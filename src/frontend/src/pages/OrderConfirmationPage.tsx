import { useParams } from '@tanstack/react-router';
import { useEmbedNavigation } from '../hooks/useEmbedNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmationPage() {
  const { navigate } = useEmbedNavigation();
  const { orderId } = useParams({ strict: false }) as { orderId?: string };

  return (
    <div className="container py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Thank you for your order. We've received your order and will process it shortly.
            </p>
            {orderId && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Order ID</p>
                <p className="font-mono text-lg font-semibold bg-muted px-4 py-2 rounded-lg inline-block">
                  {orderId}
                </p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">What's next?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You'll receive an order confirmation email shortly</li>
              <li>We'll notify you when your order ships</li>
              <li>Track your order status using your order ID</li>
            </ul>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
