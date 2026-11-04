import { useId } from 'react';
import type { RoomFieldsValue } from '@/features/editor/shared/EditorTypes.ts';

type RoomFieldsProps = {
  value: RoomFieldsValue;
  onChange: (value: RoomFieldsValue) => void;
};

export function RoomFields({ value, onChange }: RoomFieldsProps) {
  const id = useId();
  return (
    <div className="room-fields">
      <label htmlFor={`${id}-name`}>Name</label>
      <input id={`${id}-name`} required value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
      <label htmlFor={`${id}-width`}>Width (m)</label>
      <input id={`${id}-width`} type="number" required min="0.5" step="0.1" value={value.width} onChange={(event) => onChange({ ...value, width: event.target.value })} />
      <label htmlFor={`${id}-length`}>Length (m)</label>
      <input id={`${id}-length`} type="number" required min="0.5" step="0.1" value={value.length} onChange={(event) => onChange({ ...value, length: event.target.value })} />
    </div>
  );
}
