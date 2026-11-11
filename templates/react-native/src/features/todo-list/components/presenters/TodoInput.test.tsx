import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';

describe('TodoInput', () => {
  it('sends the typed title and empties the field', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn<(title: string) => void>();
    await render(<TodoInput onAdd={onAdd} />);
    await user.type(screen.getByLabelText('New task'), 'Buy oat milk');
    await user.press(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByLabelText('New task')).toHaveDisplayValue('');
    expect(onAdd).toHaveBeenCalledWith('Buy oat milk');
  });

  it('says why a blank title is refused, on the field and to screen readers', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn<(title: string) => void>();
    await render(<TodoInput onAdd={onAdd} />);
    await user.type(screen.getByLabelText('New task'), '   ', { submitEditing: true });
    expect(screen.getByRole('alert')).toHaveTextContent('The title is blank');
    expect(screen.getByLabelText('New task')).toHaveProp('accessibilityHint', 'The title is blank');
    expect(onAdd).not.toHaveBeenCalled();
  });
});
