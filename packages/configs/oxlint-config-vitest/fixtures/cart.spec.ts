import { describe, expect, it, test, vi } from 'vitest';

it('counts outside a describe', () => {
  expect(1, 'one item').toBe(1);
});

describe('cart', () => {
  test('counts inside a describe', () => {
    expect(() => {
      throw new Error('empty');
    }).toThrow();
  });

  it('calls back', () => {
    const onEmpty = vi.fn();
    const typed = vi.fn<() => void>();
    expect(onEmpty).not.toHaveBeenCalled();
    expect(typed).not.toHaveBeenCalled();
    expect([1]).toEqual([1]);
    expect(Boolean(typed)).toBeTruthy();
    expect(typed).toHaveBeenCalledOnce();
    expect(typed.mock.lastCall).toBe(null);
    expect(1, 'one item', 'extra').toBe(1);
  });
});
