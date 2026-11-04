import { computeArea } from '@/shared/lib/computeArea.ts';
import { formatLength } from '@/shared/lib/formatLength.ts';
import { formatSurface } from '@/shared/lib/formatSurface.ts';
import type { Room } from '@/states/floor-plan/FloorPlanTypes.ts';

type SurfaceTableProps = {
  rooms: Room[];
  totalArea: number;
};

export function SurfaceTable({ rooms, totalArea }: SurfaceTableProps) {
  return (
    <table className="surface-table">
      <caption>Surfaces</caption>
      <thead>
        <tr>
          <th scope="col">Room</th>
          <th scope="col">Width</th>
          <th scope="col">Length</th>
          <th scope="col">Area</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <th scope="row">{room.name}</th>
            <td>{formatLength(room.width)}</td>
            <td>{formatLength(room.length)}</td>
            <td>{formatSurface(computeArea(room))}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colSpan={3}>
            Total
          </th>
          <td>{formatSurface(totalArea)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
