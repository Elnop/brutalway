import type { Viewport } from 'next';

export function generateViewport(): Viewport {
  return { themeColor: 'white' };
}

export default function DocsPage() {
  return <main>Docs</main>;
}
