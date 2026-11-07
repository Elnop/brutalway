import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';

const TODO = { id: 'milk', title: 'Buy milk', completed: false };

function handlers() {
  return { onToggle: vi.fn<(id: string) => void>(), onRename: vi.fn<(id: string, title: string) => void>(), onRemove: vi.fn<(id: string) => void>() };
}

describe('TodoItem', () => {
  it('toggles and deletes the todo', async () => {
    const props = handlers();
    const screen = await render(<TodoItem todo={TODO} {...props} />);
    await screen.getByRole('checkbox', { name: 'Buy milk' }).click();
    expect(props.onToggle).toHaveBeenCalledWith('milk');
    await screen.getByRole('button', { name: 'Delete Buy milk' }).click();
    expect(props.onRemove).toHaveBeenCalledWith('milk');
  });

  it('renames through the editor, and Escape cancels', async () => {
    const props = handlers();
    const screen = await render(<TodoItem todo={TODO} {...props} />);
    await screen.getByRole('button', { name: 'Edit Buy milk' }).click();
    await screen.getByLabelText('Rename Buy milk').fill('Buy oat milk');
    await screen.getByRole('button', { name: 'Save' }).click();
    await screen.getByRole('button', { name: 'Edit Buy milk' }).click();
    expect(props.onRename).toHaveBeenCalledWith('milk', 'Buy oat milk');

    await screen.getByLabelText('Rename Buy milk').fill('Something else');
    screen
      .getByLabelText('Rename Buy milk')
      .element()
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await expect.element(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeVisible();
    expect(props.onRename).toHaveBeenCalledTimes(1);
  });

  it('shows a done todo as checked', async () => {
    const screen = await render(<TodoItem todo={{ ...TODO, completed: true }} {...handlers()} />);
    await expect.element(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked();
  });
});
