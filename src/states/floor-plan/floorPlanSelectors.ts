import { computeArea } from '@/shared/lib/computeArea.ts';
import type { FloorPlanState, Room } from '@/states/floor-plan/FloorPlanTypes.ts';

export function selectSelectedRoom(state: FloorPlanState): Room | null {
  return state.rooms.find((room) => room.id === state.selectedId) ?? null;
}

export function selectTotalArea(state: FloorPlanState): number {
  return state.rooms.reduce((total, room) => total + computeArea(room), 0);
}
