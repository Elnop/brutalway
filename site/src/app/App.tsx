import { AuthorsSection } from '@/features/authors/AuthorsSection.tsx';
import { AxiomGrid } from '@/features/axiom-grid/AxiomGrid.tsx';
import { ErrorShowcase } from '@/features/error-showcase/ErrorShowcase.tsx';
import { Hero } from '@/features/hero/Hero.tsx';
import { NameOrigin } from '@/features/name-origin/NameOrigin.tsx';
import { SiteFooter } from '@/features/site-footer/SiteFooter.tsx';
import { SiteHeader } from '@/features/site-header/SiteHeader.tsx';
import { StackGrid } from '@/features/stack-grid/StackGrid.tsx';

export function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <NameOrigin />
        <AxiomGrid />
        <ErrorShowcase />
        <AuthorsSection />
        <StackGrid />
      </main>
      <SiteFooter />
    </>
  );
}
