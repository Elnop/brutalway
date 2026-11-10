import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';

function handlers() {
  return { onSave: vi.fn<(title: string) => void>(), onCancel: vi.fn<() => void>() };
}

describe('TodoEditor', () => {
  it('refuses a blank title and says why', async () => {
    const props = handlers();
    const screen = await render(<TodoEditor title="Buy milk" {...props} />);
    await screen.getByLabelText('Rename Buy milk').fill('  ');
    await screen.getByRole('button', { name: 'Save' }).click();
    await expect.element(screen.getByRole('alert')).toHaveTextContent('The title is blank');
    await expect
      .element(screen.getByLabelText('Rename Buy milk'))
      .toHaveAttribute('aria-invalid', 'true');
    expect(props.onSave).not.toHaveBeenCalled();
  });

  it('cancels on Escape only', async () => {
    const props = handlers();
    const screen = await render(<TodoEditor title="Buy milk" {...props} />);
    const field = screen.getByLabelText('Rename Buy milk').element();
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(props.onCancel).not.toHaveBeenCalled();
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});
