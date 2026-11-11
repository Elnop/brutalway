import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

describe('TodoFilters', () => {
  it('marks the current filter and sends the one picked', async () => {
    const onChange = jest.fn<(filter: TodoFilter) => void>();
    await render(<TodoFilters filter="active" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Active' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'All' })).not.toBeSelected();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Done' }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });
});
