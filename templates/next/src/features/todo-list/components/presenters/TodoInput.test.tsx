import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';

describe('TodoInput', () => {
  it('sends the typed title and empties the field', async () => {
    const onAdd = vi.fn<(title: string) => void>();
    const screen = await render(<TodoInput onAdd={onAdd} />);
    await screen.getByLabelText('New task').fill('Buy oat milk');
    await screen.getByRole('button', { name: 'Add' }).click();
    await expect.element(screen.getByLabelText('New task')).toHaveValue('');
    expect(onAdd).toHaveBeenCalledWith('Buy oat milk');
  });

  it('says why a blank title is refused, on the field and to screen readers', async () => {
    const onAdd = vi.fn<(title: string) => void>();
    const screen = await render(<TodoInput onAdd={onAdd} />);
    await screen.getByLabelText('New task').fill('   ');
    await screen.getByRole('button', { name: 'Add' }).click();
    await expect.element(screen.getByRole('alert')).toHaveTextContent('The title is blank');
    await expect.element(screen.getByLabelText('New task')).toHaveAttribute('aria-invalid', 'true');
    expect(onAdd).not.toHaveBeenCalled();
  });
});
