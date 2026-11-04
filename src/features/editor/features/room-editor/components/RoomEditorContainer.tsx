import { RoomEditor } from '@/features/editor/features/room-editor/components/RoomEditor.tsx';
import { floorPlanActions } from '@/states/floor-plan/floorPlanStore.ts';
import { selectSelectedRoom } from '@/states/floor-plan/floorPlanSelectors.ts';
import { useFloorPlan } from '@/states/floor-plan/useFloorPlan.ts';

export function RoomEditorContainer() {
  const room = useFloorPlan(selectSelectedRoom);
  if (room === null) return null;
  return (
    <RoomEditor key={room.id} room={room} onSave={(draft) => floorPlanActions.update(room.id, draft)} onRemove={() => floorPlanActions.remove(room.id)} onClose={() => floorPlanActions.select(null)} />
  );
}
