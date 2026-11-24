import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';

function handlers() {
  return { onSave: jest.fn<(title: string) => void>(), onCancel: jest.fn<() => void>() };
}

describe('TodoEditor', () => {
  it('refuses a blank title and says why', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoEditor title="Buy milk" {...props} />);
    await user.clear(screen.getByLabelText('Rename Buy milk'));
    await user.type(screen.getByLabelText('Rename Buy milk'), '  ');
    await user.press(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert')).toHaveTextContent('The title is blank');
    expect(props.onSave).not.toHaveBeenCalled();
  });

  it('saves when the keyboard submits, and cancels on Cancel', async () => {
    const user = userEvent.setup();
    const props = handlers();
    await render(<TodoEditor title="Buy milk" {...props} />);
    await user.type(screen.getByLabelText('Rename Buy milk'), ' now', { submitEditing: true });
    expect(props.onSave).toHaveBeenCalledWith('Buy milk now');
    await user.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});
