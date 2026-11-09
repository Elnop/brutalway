import type { ReactNode } from 'react';
import { SiteFooter } from '@/features/site/features/footer/SiteFooter.tsx';
import { SiteHeader } from '@/features/site/features/header/SiteHeader.tsx';
import { ThemeSwitch } from '@/features/site/features/theme-switch/ThemeSwitch.tsx';

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <>
      <SiteHeader actions={<ThemeSwitch />} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
