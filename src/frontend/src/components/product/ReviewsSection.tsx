import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductReview } from '../../models/product';

interface ReviewsSectionProps {
  reviews?: ProductReview;
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.count === 0) {
    return null;
  }

  const rating = reviews.averageRating || reviews.rating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
            <Badge variant="secondary">{reviews.count.toLocaleString()} reviews</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
