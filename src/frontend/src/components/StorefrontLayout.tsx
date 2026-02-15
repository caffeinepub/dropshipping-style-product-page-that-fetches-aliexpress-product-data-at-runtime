import { Link, Outlet } from '@tanstack/react-router';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../cart/useCart';
import { useEmbedMode } from '../hooks/useEmbedMode';
import { useEmbedNavigation } from '../hooks/useEmbedNavigation';

export default function StorefrontLayout({ children }: { children?: React.ReactNode }) {
  const { itemCount } = useCart();
  const isEmbedMode = useEmbedMode();
  const { navigate } = useEmbedNavigation();

  if (isEmbedMode) {
    // Minimal layout for embed mode
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <span className="font-semibold text-lg">ShopDirect</span>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    );
  }

  // Full layout for normal mode
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-bold text-xl">ShopDirect</span>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children || <Outlet />}
      </main>

      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted source for quality products at great prices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Customer Service</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Shipping Information</li>
                <li>Returns & Exchanges</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: support@shopdirect.com
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ShopDirect. All rights reserved.</p>
            <p>
              Built with <Heart className="inline h-4 w-4 text-red-500 fill-current" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'shopdirect'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
