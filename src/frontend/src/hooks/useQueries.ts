import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { normalizeProduct } from '../lib/aliExpress/normalizeProduct';
import { fetchProductFromBackend } from '../lib/aliExpress/productSource';
import type { ProductModel } from '../models/product';
import type { CustomerInfo } from '../backend';

export function useFetchProduct(url?: string) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<ProductModel>({
    queryKey: ['product', url || 'default'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      const rawHtml = await fetchProductFromBackend(actor, url);
      return normalizeProduct(rawHtml);
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerInfo, totalAmount }: { customerInfo: CustomerInfo; totalAmount: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const orderId = await actor.placeOrder(customerInfo, BigInt(Math.round(totalAmount * 100)));
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
