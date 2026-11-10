import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

describe('TodoFilters', () => {
  it('marks the current filter and sends the one picked', async () => {
    const onChange = vi.fn<(filter: TodoFilter) => void>();
    const screen = await render(<TodoFilters filter="active" onChange={onChange} />);
    await expect
      .element(screen.getByRole('button', { name: 'Active' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect
      .element(screen.getByRole('button', { name: 'All' }))
      .toHaveAttribute('aria-pressed', 'false');
    await screen.getByRole('button', { name: 'Done' }).click();
    expect(onChange).toHaveBeenCalledWith('completed');
  });
});
