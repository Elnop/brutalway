import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';

const TODO = { id: 'milk', title: 'Buy milk', completed: false };

function handlers() {
  return {
    onToggle: jest.fn<(id: string) => void>(),
    onRename: jest.fn<(id: string, title: string) => void>(),
    onRemove: jest.fn<(id: string) => void>(),
  };
}

describe('TodoItem', () => {
  it('toggles and deletes the todo', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoItem todo={TODO} {...props} />);
    await user.press(screen.getByRole('checkbox', { name: 'Buy milk' }));
    expect(props.onToggle).toHaveBeenCalledWith('milk');
    await user.press(screen.getByRole('button', { name: 'Delete Buy milk' }));
    expect(props.onRemove).toHaveBeenCalledWith('milk');
  });

  it('renames through the editor, and Cancel leaves the title as it was', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoItem todo={TODO} {...props} />);
    await user.press(screen.getByRole('button', { name: 'Edit Buy milk' }));
    await user.clear(screen.getByLabelText('Rename Buy milk'));
    await user.type(screen.getByLabelText('Rename Buy milk'), 'Buy oat milk');
    await user.press(screen.getByRole('button', { name: 'Save' }));
    expect(props.onRename).toHaveBeenCalledWith('milk', 'Buy oat milk');

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
