import { computeArea } from '@/shared/lib/computeArea.ts';
import { formatSurface } from '@/shared/lib/formatSurface.ts';
import type { Room } from '@/states/floor-plan/FloorPlanTypes.ts';

type RoomListProps = {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function RoomList({ rooms, selectedId, onSelect }: RoomListProps) {
  if (rooms.length === 0) return <p className="editor-empty">No room yet: add one below.</p>;
  return (
    <ul className="room-list">
      {rooms.map((room) => (
        <li key={room.id}>
          <button type="button" className="room-list-item" aria-pressed={room.id === selectedId} onClick={() => onSelect(room.id)}>
            <span>{room.name}</span>
            <span>{formatSurface(computeArea(room))}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
