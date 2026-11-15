import { ImageResponse } from 'next/og';

export const alt = 'Todos';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(<div>{alt}</div>, size);
}
