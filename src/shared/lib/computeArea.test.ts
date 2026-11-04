import { describe, expect, it } from 'vitest';
import { computeArea } from '@/shared/lib/computeArea.ts';

describe('computeArea', () => {
  it('multiplies width by length', () => {
    expect(computeArea({ width: 3.5, length: 4 })).toBe(14);
  });
});
