import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';

const TODOS = [
  { id: 7, title: 'Buy milk', completed: false },
  { id: 8, title: 'Buy bread', completed: true },
];

function handlers() {
  return {
    onToggle: vi.fn<(id: number) => void>(),
    onRename: vi.fn<(id: number, title: string) => void>(),
    onRemove: vi.fn<(id: number) => void>(),
  };
}

describe('TodoItems', () => {
  it('lists each todo', async () => {
    const screen = await render(<TodoItems todos={TODOS} {...handlers()} />);
    await expect.element(screen.getByRole('checkbox', { name: 'Buy milk' })).not.toBeChecked();
    await expect.element(screen.getByRole('checkbox', { name: 'Buy bread' })).toBeChecked();
  });

  it('says the list is empty when there is no todo', async () => {
    const screen = await render(<TodoItems todos={[]} {...handlers()} />);
    await expect.element(screen.getByText('Nothing here.')).toBeVisible();
    expect(screen.container.querySelector('ul')).toBeNull();
  });
});
