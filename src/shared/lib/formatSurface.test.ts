import { describe, expect, it } from 'vitest';
import { formatSurface } from '@/shared/lib/formatSurface.ts';

describe('formatSurface', () => {
  it('keeps two decimals and the square metre unit', () => {
    expect(formatSurface(41.7)).toBe('41.70 m²');
    expect(formatSurface(10.556)).toBe('10.56 m²');
  });
});
