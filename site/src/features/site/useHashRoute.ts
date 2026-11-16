import { useEffect } from 'react';
import { useHash } from '@/shared/hash/useHash.ts';
import { PAGE_ROUTES } from '@/shared/links/LinksConfig.ts';

export function useHashRoute(): { isDocs: boolean } {
  const hash = useHash();
  const isDocs = PAGE_ROUTES.some((route) => hash.startsWith(route));
  useEffect(() => {
    if (isDocs) return;
    if (hash.length <= 1) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, isDocs]);
  return { isDocs };
}
