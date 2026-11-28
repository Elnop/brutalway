import type { Metadata } from 'next';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@/app/globals.css';
import { createI18n } from '@/app/createI18n.ts';
import { I18nProvider } from '@/app/I18nProvider.tsx';

type RootLayoutProps = { children: ReactNode };

export function generateMetadata(): Metadata {
  const t = createI18n().getFixedT(null, 'app');
  return { title: t('title') };
}

export default async function RootLayout({ children }: RootLayoutProps) {
  await connection();
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
