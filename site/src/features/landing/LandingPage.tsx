import { AuthorsSection } from '@/features/landing/features/authors/AuthorsSection.tsx';
import { AxiomGrid } from '@/features/landing/features/axiom-grid/AxiomGrid.tsx';
import { ErrorShowcase } from '@/features/landing/features/error-showcase/ErrorShowcase.tsx';
import { Hero } from '@/features/landing/features/hero/Hero.tsx';
import { NameOrigin } from '@/features/landing/features/name-origin/NameOrigin.tsx';
import { StackGrid } from '@/features/landing/features/stack-grid/StackGrid.tsx';

export function LandingPage() {
  return (
    <>
      <Hero />
      <NameOrigin />
      <AxiomGrid />
      <ErrorShowcase />
      <AuthorsSection />
      <StackGrid />
    </>
  );
}
