import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductDescriptionProps {
  description: string;
  specifications?: Record<string, string>;
}

export default function ProductDescription({ description, specifications }: ProductDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="description">
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{description}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {specifications && Object.keys(specifications).length > 0 && (
            <AccordionItem value="specifications">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <dt className="font-medium">{key}</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
