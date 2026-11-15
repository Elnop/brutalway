import type { ReactNode } from 'react';

type RootProps = { children: ReactNode };

export default function Root({ children }: RootProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
