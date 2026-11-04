import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { RoomFields } from '@/features/editor/shared/RoomFields.tsx';
import { toRoomDraft } from '@/features/editor/shared/toRoomDraft.ts';
import type { Room, RoomDraft } from '@/states/floor-plan/FloorPlanTypes.ts';
import '@/features/editor/features/room-editor/room-editor.css';

type RoomEditorProps = {
  room: Room;
  onSave: (draft: RoomDraft) => void;
  onRemove: () => void;
  onClose: () => void;
};

export function RoomEditor({ room, onSave, onRemove, onClose }: RoomEditorProps) {
  const [fields, setFields] = useState({ name: room.name, width: String(room.width), length: String(room.length) });
  const draft = toRoomDraft(fields);

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft !== null) onSave(draft);
  }

  return (
    <form className="room-editor" aria-labelledby="room-editor-title" onSubmit={submit}>
      <h3 id="room-editor-title">Edit {room.name}</h3>
      <RoomFields value={fields} onChange={setFields} />
      <div className="room-editor-actions">
        <button type="submit" disabled={draft === null}>
          Save
        </button>
        <button type="button" onClick={onRemove}>
          Delete
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  );
}
