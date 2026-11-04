import { createStore } from 'zustand/vanilla';
import { STARTER_ROOMS } from '@/states/floor-plan/FloorPlanConfig.ts';
import type { FloorPlanActions, FloorPlanState } from '@/states/floor-plan/FloorPlanTypes.ts';

export const floorPlanStore = createStore<FloorPlanState>()(() => ({ rooms: STARTER_ROOMS, selectedId: null }));

export const floorPlanActions: FloorPlanActions = {
  add: (draft) => {
    const room = { id: crypto.randomUUID(), ...draft };
    floorPlanStore.setState((state) => ({ rooms: [...state.rooms, room], selectedId: room.id }));
  },
  update: (id, draft) => floorPlanStore.setState((state) => ({ rooms: state.rooms.map((room) => (room.id === id ? { id, ...draft } : room)) })),
  remove: (id) => floorPlanStore.setState((state) => ({ rooms: state.rooms.filter((room) => room.id !== id), selectedId: state.selectedId === id ? null : state.selectedId })),
  select: (id) => floorPlanStore.setState({ selectedId: id }),
};
