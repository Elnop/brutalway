import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';

const TODO = { id: 7, title: 'Buy milk', completed: false };

function handlers() {
  return {
    onToggle: jest.fn<(id: number) => void>(),
    onRename: jest.fn<(id: number, title: string) => void>(),
    onRemove: jest.fn<(id: number) => void>(),
  };
}

describe('TodoItem', () => {
  it('toggles and deletes the todo', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoItem todo={TODO} {...props} />);
    await user.press(screen.getByRole('checkbox', { name: 'Buy milk' }));
    expect(props.onToggle).toHaveBeenCalledWith(7);
    await user.press(screen.getByRole('button', { name: 'Delete Buy milk' }));
    expect(props.onRemove).toHaveBeenCalledWith(7);
  });

  it('renames through the editor, and Cancel leaves the title as it was', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoItem todo={TODO} {...props} />);
    await user.press(screen.getByRole('button', { name: 'Edit Buy milk' }));
    await user.clear(screen.getByLabelText('Rename Buy milk'));
    await user.type(screen.getByLabelText('Rename Buy milk'), 'Buy oat milk');
    await user.press(screen.getByRole('button', { name: 'Save' }));
    expect(props.onRename).toHaveBeenCalledWith(7, 'Buy oat milk');

    await user.press(screen.getByRole('button', { name: 'Edit Buy milk' }));
    await user.type(screen.getByLabelText('Rename Buy milk'), ' and bread');
    await user.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeOnTheScreen();
    expect(props.onRename).toHaveBeenCalledTimes(1);
  });

  it('shows a done todo as checked', async () => {
    await render(<TodoItem todo={{ ...TODO, completed: true }} {...handlers()} />);
    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked();
  });
});
