import type { Room } from '@/states/floor-plan/FloorPlanTypes.ts';

export type PlacedRoom = Room & { x: number; y: number };

export type PlanLayout = { rooms: PlacedRoom[]; width: number; depth: number };
