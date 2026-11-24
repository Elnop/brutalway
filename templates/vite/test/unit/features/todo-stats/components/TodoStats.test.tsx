import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';

describe('TodoStats', () => {
  it('counts the tasks and clears the done ones', async () => {
    const onClearCompleted = vi.fn<() => void>();
    const screen = await render(
      <TodoStats remaining={1} completed={2} onClearCompleted={onClearCompleted} />,
    );
    await expect.element(screen.getByText('1 task left')).toBeVisible();
    await expect.element(screen.getByText('2 done')).toBeVisible();
    await screen.getByRole('button', { name: 'Clear done' }).click();
    expect(onClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('cannot clear when nothing is done', async () => {
    const screen = await render(
      <TodoStats remaining={3} completed={0} onClearCompleted={vi.fn<() => void>()} />,
    );
    await expect.element(screen.getByRole('button', { name: 'Clear done' })).toBeDisabled();
  });
});
