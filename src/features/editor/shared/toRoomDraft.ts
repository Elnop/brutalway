import type { RoomFieldsValue } from '@/features/editor/shared/EditorTypes.ts';
import type { RoomDraft } from '@/states/floor-plan/FloorPlanTypes.ts';

export function toRoomDraft({ name, width, length }: RoomFieldsValue): RoomDraft | null {
  const draft = { name: name.trim(), width: Number.parseFloat(width), length: Number.parseFloat(length) };
  const valid = draft.name !== '' && draft.width > 0 && draft.length > 0;
  return valid ? draft : null;
}
