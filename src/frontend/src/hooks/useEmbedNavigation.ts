import { useRouter } from '@tanstack/react-router';
import { useEmbedMode } from './useEmbedMode';
import { useCallback } from 'react';

export function useEmbedNavigation() {
  const router = useRouter();
  const isEmbedMode = useEmbedMode();

  const navigate = useCallback((to: string) => {
    if (isEmbedMode) {
      // Preserve embed parameter
      const separator = to.includes('?') ? '&' : '?';
      router.navigate({ to: `${to}${separator}embed=1` as any });
    } else {
      router.navigate({ to: to as any });
    }
  }, [router, isEmbedMode]);

  return { navigate, isEmbedMode };
}
