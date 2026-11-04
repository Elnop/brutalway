import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AddRoomForm } from '@/features/editor/components/presenters/AddRoomForm.tsx';
import type { RoomDraft } from '@/states/floor-plan/FloorPlanTypes.ts';

describe('AddRoomForm', () => {
  it('sends the parsed room and empties the fields', async () => {
    const onAdd = vi.fn<(draft: RoomDraft) => void>();
    const screen = await render(<AddRoomForm onAdd={onAdd} />);
    await screen.getByLabelText('Name').fill('Office');
    await screen.getByLabelText('Width (m)').fill('2.5');
    await screen.getByLabelText('Length (m)').fill('3');
    await screen.getByRole('button', { name: 'Add room' }).click();
    expect(onAdd).toHaveBeenCalledWith({ name: 'Office', width: 2.5, length: 3 });
    await expect.element(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('keeps the button disabled until every field is valid', async () => {
    const screen = await render(<AddRoomForm onAdd={vi.fn<(draft: RoomDraft) => void>()} />);
    await screen.getByLabelText('Name').fill('Office');
    await expect.element(screen.getByRole('button', { name: 'Add room' })).toBeDisabled();
  });
});
