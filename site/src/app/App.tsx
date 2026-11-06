import { useEffect } from 'react';
import { DocsPage } from '@/features/docs/components/DocsPage.tsx';
import { LandingPage } from '@/features/landing/LandingPage.tsx';
import { SiteLayout } from '@/features/site/SiteLayout.tsx';
import { DOCS_ROUTE } from '@/shared/LinksConfig.ts';
import { useHash } from '@/shared/useHash.ts';

export function App() {
  const hash = useHash();
  const isDocs = hash.startsWith(DOCS_ROUTE);
  useEffect(() => {
    if (isDocs || hash.length <= 1) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, isDocs]);
  return <SiteLayout>{isDocs ? <DocsPage hash={hash} /> : <LandingPage />}</SiteLayout>;
}
