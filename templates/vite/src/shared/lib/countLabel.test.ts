import { describe, expect, it } from 'vitest';
import { countLabel } from '@/shared/lib/countLabel.ts';

describe('countLabel', () => {
  it('uses the singular for one and the plural otherwise', () => {
    expect(countLabel(1, 'task left', 'tasks left')).toBe('1 task left');
    expect(countLabel(0, 'task left', 'tasks left')).toBe('0 tasks left');
    expect(countLabel(3, 'task left', 'tasks left')).toBe('3 tasks left');
  });
});
