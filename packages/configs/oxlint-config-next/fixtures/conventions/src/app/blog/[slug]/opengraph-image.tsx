import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };

export function generateImageMetadata(): { id: string; size: typeof size }[] {
  return [{ id: 'large', size }];
}

export default function BlogImage() {
  return new ImageResponse(<div>Blog</div>, size);
}
