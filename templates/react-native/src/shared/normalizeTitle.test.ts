import { describe, expect, it } from '@jest/globals';
import { normalizeTitle } from '@/shared/normalizeTitle.ts';

describe('normalizeTitle', () => {
  it('trims and collapses inner spaces', () => {
    expect(normalizeTitle('  buy   oat\tmilk ')).toBe('buy oat milk');
  });

  it('gives an empty string for blank input', () => {
    expect(normalizeTitle('   ')).toBe('');
  });
});
