import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { CartProvider } from './cart/useCart';
import StorefrontLayout from './components/StorefrontLayout';
import StorefrontPage from './pages/StorefrontPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <StorefrontLayout>
      <div id="router-outlet" />
    </StorefrontLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StorefrontPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation/$orderId',
  component: OrderConfirmationPage,
});

const routeTree = rootRoute.addChildren([indexRoute, cartRoute, checkoutRoute, confirmationRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
