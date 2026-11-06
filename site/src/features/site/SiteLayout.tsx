import type { ReactNode } from 'react';
import { SiteFooter } from '@/features/site/features/footer/SiteFooter.tsx';
import { SiteHeader } from '@/features/site/features/header/SiteHeader.tsx';

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
