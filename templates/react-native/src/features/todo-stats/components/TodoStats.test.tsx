import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';

describe('TodoStats', () => {
  it('counts the tasks and clears the done ones', async () => {
    const onClearCompleted = jest.fn<() => void>();
    await render(<TodoStats remaining={1} completed={2} onClearCompleted={onClearCompleted} />);
    expect(screen.getByText('1 task left')).toBeOnTheScreen();
    expect(screen.getByText('2 done')).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Clear done' }));
    expect(onClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('cannot clear when nothing is done', async () => {
    await render(
      <TodoStats remaining={3} completed={0} onClearCompleted={jest.fn<() => void>()} />,
    );
    expect(screen.getByRole('button', { name: 'Clear done' })).toBeDisabled();
  });
});
