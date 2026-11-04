import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { RoomFieldsValue } from '@/features/editor/shared/EditorTypes.ts';
import { RoomFields } from '@/features/editor/shared/RoomFields.tsx';
import { toRoomDraft } from '@/features/editor/shared/toRoomDraft.ts';
import type { RoomDraft } from '@/states/floor-plan/FloorPlanTypes.ts';

type AddRoomFormProps = {
  onAdd: (draft: RoomDraft) => void;
};

const EMPTY_FIELDS: RoomFieldsValue = { name: '', width: '', length: '' };

export function AddRoomForm({ onAdd }: AddRoomFormProps) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const draft = toRoomDraft(fields);

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft === null) return;
    onAdd(draft);
    setFields(EMPTY_FIELDS);
  }

  return (
    <form className="add-room" aria-labelledby="add-room-title" onSubmit={submit}>
      <h3 id="add-room-title">New room</h3>
      <RoomFields value={fields} onChange={setFields} />
      <button type="submit" disabled={draft === null}>
        Add room
      </button>
    </form>
  );
}
