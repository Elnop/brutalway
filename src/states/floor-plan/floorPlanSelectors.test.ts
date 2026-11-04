import { describe, expect, it } from 'vitest';
import { STARTER_ROOMS } from '@/states/floor-plan/FloorPlanConfig.ts';
import { selectSelectedRoom, selectTotalArea } from '@/states/floor-plan/floorPlanSelectors.ts';

describe('floor plan selectors', () => {
  it('finds the selected room, or null when nothing is selected', () => {
    expect(selectSelectedRoom({ rooms: STARTER_ROOMS, selectedId: 'kitchen' })?.name).toBe('Kitchen');
    expect(selectSelectedRoom({ rooms: STARTER_ROOMS, selectedId: null })).toBeNull();
  });

  it('adds up the area of every room', () => {
    expect(selectTotalArea({ rooms: STARTER_ROOMS, selectedId: null })).toBeCloseTo(41.7);
  });
});
