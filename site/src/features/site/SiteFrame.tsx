import type { ReactNode } from 'react';
import { SiteFooter } from '@/features/site/features/footer/SiteFooter.tsx';
import { SiteHeader } from '@/features/site/features/header/SiteHeader.tsx';

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
