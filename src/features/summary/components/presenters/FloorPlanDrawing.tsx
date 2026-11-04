import type { KeyboardEvent } from 'react';
import type { PlanLayout } from '@/features/summary/SummaryTypes.ts';
import { PLAN } from '@/shared/PlanConfig.ts';
import { formatLength } from '@/shared/lib/formatLength.ts';

type FloorPlanDrawingProps = {
  layout: PlanLayout;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const UNIT = PLAN.unitsPerMeter;

export function FloorPlanDrawing({ layout, selectedId, onSelect }: FloorPlanDrawingProps) {
  if (layout.rooms.length === 0) return <p className="plan-empty">The plan is empty.</p>;

  function selectWithKeyboard(event: KeyboardEvent, id: string) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(id);
  }

  const margin = PLAN.margin * UNIT;
  const width = layout.width * UNIT;
  const depth = layout.depth * UNIT;
  const dimensionY = -margin / 2;
  return (
    <svg className="plan" viewBox={`${-margin} ${-margin} ${width + 2 * margin} ${depth + 2 * margin}`} role="group" aria-label="Floor plan drawing">
      <g className="plan-dimension" aria-hidden="true">
        <line x1={0} y1={dimensionY} x2={width} y2={dimensionY} />
        <line x1={0} y1={dimensionY - 6} x2={0} y2={dimensionY + 6} />
        <line x1={width} y1={dimensionY - 6} x2={width} y2={dimensionY + 6} />
        <text x={width / 2} y={dimensionY - 8}>
          {formatLength(layout.width)}
        </text>
      </g>
      {layout.rooms.map((room) => (
        <g
          key={room.id}
          className="plan-room"
          role="button"
          tabIndex={0}
          aria-pressed={room.id === selectedId}
          onClick={() => onSelect(room.id)}
          onKeyDown={(event) => selectWithKeyboard(event, room.id)}
        >
          <rect x={room.x * UNIT} y={room.y * UNIT} width={room.width * UNIT} height={room.length * UNIT} />
          <text x={(room.x + room.width / 2) * UNIT} y={(room.y + room.length / 2) * UNIT}>
            {room.name}
          </text>
          <text className="plan-room-size" x={(room.x + room.width / 2) * UNIT} y={(room.y + room.length / 2) * UNIT + 20}>
            {`${room.width} × ${room.length}`}
          </text>
        </g>
      ))}
    </svg>
  );
}
