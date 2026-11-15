'use client';

type GlobalErrorProps = { error: Error };

export default function GlobalError({ error }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>{error.message}</body>
    </html>
  );
}
