import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { FloorPlanDrawing } from '@/features/summary/components/presenters/FloorPlanDrawing.tsx';

const layout = {
  rooms: [
    { id: 'kitchen', name: 'Kitchen', width: 3, length: 3.5, x: 0, y: 0 },
    { id: 'bedroom', name: 'Bedroom', width: 3.5, length: 3.2, x: 3.6, y: 0 },
  ],
  width: 7.1,
  depth: 3.5,
};

describe('FloorPlanDrawing', () => {
  it('selects a room on click and marks the selected one', async () => {
    const onSelect = vi.fn<(id: string) => void>();
    const screen = await render(<FloorPlanDrawing layout={layout} selectedId="kitchen" onSelect={onSelect} />);
    await expect.element(screen.getByRole('button', { name: /Kitchen/u })).toHaveAttribute('aria-pressed', 'true');
    await screen.getByRole('button', { name: /Bedroom/u }).click();
    expect(onSelect).toHaveBeenCalledWith('bedroom');
  });

  it('says so when there is no room', async () => {
    const screen = await render(<FloorPlanDrawing layout={{ rooms: [], width: 0, depth: 0 }} selectedId={null} onSelect={vi.fn<(id: string) => void>()} />);
    await expect.element(screen.getByText('The plan is empty.')).toBeVisible();
  });
});
