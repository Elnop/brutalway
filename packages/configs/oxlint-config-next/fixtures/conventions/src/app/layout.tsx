import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

type RootLayoutProps = { children: ReactNode; modal: ReactNode };

export const metadata: Metadata = { title: 'Todos' };
export const viewport: Viewport = { themeColor: 'black' };

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
