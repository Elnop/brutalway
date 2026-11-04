import { useMemo } from 'react';
import { FloorPlanDrawing } from '@/features/summary/components/presenters/FloorPlanDrawing.tsx';
import { SurfaceTable } from '@/features/summary/components/presenters/SurfaceTable.tsx';
import { layoutRooms } from '@/features/summary/layoutRooms.ts';
import { PLAN } from '@/shared/PlanConfig.ts';
import { floorPlanActions } from '@/states/floor-plan/floorPlanStore.ts';
import { selectTotalArea } from '@/states/floor-plan/floorPlanSelectors.ts';
import { useFloorPlan } from '@/states/floor-plan/useFloorPlan.ts';
import '@/features/summary/summary.css';

export function SummaryContainer() {
  const rooms = useFloorPlan((state) => state.rooms);
  const selectedId = useFloorPlan((state) => state.selectedId);
  const totalArea = useFloorPlan(selectTotalArea);
  const layout = useMemo(() => layoutRooms(rooms, PLAN.rowWidth, PLAN.gap), [rooms]);
  return (
    <section className="summary panel" aria-labelledby="summary-title">
      <h2 id="summary-title">Plan</h2>
      <FloorPlanDrawing layout={layout} selectedId={selectedId} onSelect={floorPlanActions.select} />
      <SurfaceTable rooms={rooms} totalArea={totalArea} />
    </section>
  );
}
