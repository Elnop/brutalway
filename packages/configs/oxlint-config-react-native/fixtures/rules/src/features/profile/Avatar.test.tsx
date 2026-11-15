import { describe, expect, it } from '@jest/globals';

describe('Avatar', () => {
  it('compares deeply', () => {
    expect({ name: 'Ada' }).toEqual({ name: 'Ada' });
  });
});
