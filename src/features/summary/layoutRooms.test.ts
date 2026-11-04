import { describe, expect, it } from 'vitest';
import { layoutRooms } from '@/features/summary/layoutRooms.ts';

function room(id: string, width: number, length: number) {
  return { id, name: id, width, length };
}

describe('layoutRooms', () => {
  it('places rooms side by side with a gap', () => {
    const layout = layoutRooms([room('a', 4, 3), room('b', 2, 5)], 12, 1);
    expect(layout.rooms.map(({ x, y }) => [x, y])).toStrictEqual([
      [0, 0],
      [5, 0],
    ]);
    expect([layout.width, layout.depth]).toStrictEqual([7, 5]);
  });

  it('starts a new row below the deepest room when the row is full', () => {
    const layout = layoutRooms([room('a', 6, 3), room('b', 6, 4), room('c', 3, 2)], 12, 1);
    expect(layout.rooms.map(({ x, y }) => [x, y])).toStrictEqual([
      [0, 0],
      [0, 4],
      [7, 4],
    ]);
  });

  it('gives an empty plan no size', () => {
    expect(layoutRooms([], 12, 1)).toStrictEqual({ rooms: [], width: 0, depth: 0 });
  });
});
