import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';

const TODOS = [
  { id: 7, title: 'Buy milk', completed: false },
  { id: 8, title: 'Buy bread', completed: true },
];

function handlers() {
  return {
    onToggle: jest.fn<(id: number) => void>(),
    onRename: jest.fn<(id: number, title: string) => void>(),
    onRemove: jest.fn<(id: number) => void>(),
  };
}

describe('TodoItems', () => {
  it('lists each todo', async () => {
    await render(<TodoItems todos={TODOS} {...handlers()} />);
    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Buy bread' })).toBeChecked();
  });

  it('says the list is empty when there is no todo', async () => {
    await render(<TodoItems todos={[]} {...handlers()} />);
    expect(screen.getByText('Nothing here.')).toBeOnTheScreen();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
