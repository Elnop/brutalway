import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';

describe('TodoInput', () => {
  it('sends the typed title and empties the field', async () => {
    const onAdd = vi.fn<(title: string) => void>();
    const screen = await render(<TodoInput onAdd={onAdd} />);
    await screen.getByLabelText('New task').fill('Buy oat milk');
    await screen.getByRole('button', { name: 'Add' }).click();
    expect(onAdd).toHaveBeenCalledWith('Buy oat milk');
    await expect.element(screen.getByLabelText('New task')).toHaveValue('');
  });

  it('keeps the button disabled while the title is blank', async () => {
    const screen = await render(<TodoInput onAdd={vi.fn<(title: string) => void>()} />);
    await screen.getByLabelText('New task').fill('   ');
    await expect.element(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });
});
