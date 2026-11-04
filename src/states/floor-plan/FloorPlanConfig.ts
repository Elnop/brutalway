import type { Room } from '@/states/floor-plan/FloorPlanTypes.ts';

export const STARTER_ROOMS: Room[] = [
  { id: 'living-room', name: 'Living room', width: 5, length: 4 },
  { id: 'kitchen', name: 'Kitchen', width: 3, length: 3.5 },
  { id: 'bedroom', name: 'Bedroom', width: 3.5, length: 3.2 },
];
