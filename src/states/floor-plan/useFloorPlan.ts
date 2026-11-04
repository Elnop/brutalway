import { useStore } from 'zustand';
import { floorPlanStore } from '@/states/floor-plan/floorPlanStore.ts';
import type { FloorPlanState } from '@/states/floor-plan/FloorPlanTypes.ts';

export function useFloorPlan<T>(selector: (state: FloorPlanState) => T): T {
  return useStore(floorPlanStore, selector);
}
