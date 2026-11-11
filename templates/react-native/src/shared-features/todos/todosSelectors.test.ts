import { describe, expect, it } from '@jest/globals';
import { STARTER_TODOS } from '@/shared-features/todos/TodosConfig.ts';
import {
  selectCompletedCount,
  selectRemainingCount,
  selectVisibleTodos,
} from '@/shared-features/todos/todosSelectors.ts';

describe('todos selectors', () => {
  it('filters the visible todos', () => {
    expect(selectVisibleTodos({ todos: STARTER_TODOS, filter: 'all' })).toHaveLength(3);
    expect(
      selectVisibleTodos({ todos: STARTER_TODOS, filter: 'active' }).map((todo) => todo.id),
    ).toStrictEqual(['run-the-checks', 'write-a-feature']);
    expect(
      selectVisibleTodos({ todos: STARTER_TODOS, filter: 'completed' }).map((todo) => todo.id),
    ).toStrictEqual(['read-the-readme']);
  });

  it('counts remaining and completed todos', () => {
    expect(selectRemainingCount({ todos: STARTER_TODOS, filter: 'all' })).toBe(2);
    expect(selectCompletedCount({ todos: STARTER_TODOS, filter: 'all' })).toBe(1);
  });
});
