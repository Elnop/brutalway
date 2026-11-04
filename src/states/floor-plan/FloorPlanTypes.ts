import type { Dimensions } from '@/shared/PlanTypes.ts';

export type RoomDraft = Dimensions & { name: string };

export type Room = RoomDraft & { id: string };

export type FloorPlanState = {
  rooms: Room[];
  selectedId: string | null;
};

export type FloorPlanActions = {
  add: (draft: RoomDraft) => void;
  update: (id: string, draft: RoomDraft) => void;
  remove: (id: string) => void;
  select: (id: string | null) => void;
};
