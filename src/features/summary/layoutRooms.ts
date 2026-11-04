import type { PlanLayout, PlacedRoom } from '@/features/summary/SummaryTypes.ts';
import type { Room } from '@/states/floor-plan/FloorPlanTypes.ts';

export function layoutRooms(rooms: Room[], rowWidth: number, gap: number): PlanLayout {
  const placed: PlacedRoom[] = [];
  let x = 0;
  let y = 0;
  let rowDepth = 0;
  for (const room of rooms) {
    if (x > 0 && x + room.width > rowWidth) {
      x = 0;
      y += rowDepth + gap;
      rowDepth = 0;
    }
    placed.push({ ...room, x, y });
    x += room.width + gap;
    rowDepth = Math.max(rowDepth, room.length);
  }
  const width = Math.max(0, ...placed.map((room) => room.x + room.width));
  const depth = Math.max(0, ...placed.map((room) => room.y + room.length));
  return { rooms: placed, width, depth };
}
