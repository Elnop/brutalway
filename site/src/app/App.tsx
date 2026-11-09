import { useEffect } from 'react';
import { DocsPage } from '@/features/docs/components/DocsPage.tsx';
import { LandingPage } from '@/features/landing/LandingPage.tsx';
import { SiteFrame } from '@/features/site/SiteFrame.tsx';
import { PAGE_ROUTES } from '@/shared/configs/LinksConfig.ts';
import { useHash } from '@/shared/hooks/useHash.ts';

export function App() {
  const hash = useHash();
  const isDocs = PAGE_ROUTES.some((route) => hash.startsWith(route));
  useEffect(() => {
    if (isDocs || hash.length <= 1) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, isDocs]);
  return <SiteFrame>{isDocs ? <DocsPage /> : <LandingPage />}</SiteFrame>;
}
