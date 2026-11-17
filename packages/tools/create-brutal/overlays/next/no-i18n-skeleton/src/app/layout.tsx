import type { Metadata } from 'next';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@/app/globals.css';

type RootLayoutProps = { children: ReactNode };

export const metadata: Metadata = { title: '__PROJECT_NAME__' };

export default async function RootLayout({ children }: RootLayoutProps) {
  await connection();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
