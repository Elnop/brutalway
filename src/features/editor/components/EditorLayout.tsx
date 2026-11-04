import { AddRoomForm } from '@/features/editor/components/presenters/AddRoomForm.tsx';
import { RoomList } from '@/features/editor/components/presenters/RoomList.tsx';
import { RoomEditorContainer } from '@/features/editor/features/room-editor/components/RoomEditorContainer.tsx';
import { floorPlanActions } from '@/states/floor-plan/floorPlanStore.ts';
import { useFloorPlan } from '@/states/floor-plan/useFloorPlan.ts';
import '@/features/editor/editor.css';

export function EditorLayout() {
  const rooms = useFloorPlan((state) => state.rooms);
  const selectedId = useFloorPlan((state) => state.selectedId);
  return (
    <section className="editor panel" aria-labelledby="editor-title">
      <h2 id="editor-title">Rooms</h2>
      <RoomList rooms={rooms} selectedId={selectedId} onSelect={floorPlanActions.select} />
      <RoomEditorContainer />
      <AddRoomForm onAdd={floorPlanActions.add} />
    </section>
  );
}
