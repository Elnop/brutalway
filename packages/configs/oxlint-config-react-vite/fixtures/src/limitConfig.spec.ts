import { expect, test } from 'vitest';
import { LIMIT } from '@/limitConfig.ts';

test('limit', () => {
  expect(LIMIT).toEqual(3);
});
