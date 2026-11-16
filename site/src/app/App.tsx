import { DocsPage } from '@/features/docs/components/DocsPage.tsx';
import { LandingPage } from '@/features/landing/LandingPage.tsx';
import { SiteFrame } from '@/features/site/SiteFrame.tsx';
import { useHashRoute } from '@/features/site/useHashRoute.ts';

export function App() {
  const { isDocs } = useHashRoute();
  return <SiteFrame>{isDocs ? <DocsPage /> : <LandingPage />}</SiteFrame>;
}
