import { beforeEach, describe, expect, it } from '@jest/globals';
import { todosActions, todosStore } from '@/shared-features/todos/todosStore.ts';

describe('todosActions', () => {
  beforeEach(() => {
    todosStore.setState({ filter: 'all' });
  });

  it('keeps the filter, the only state that does not come from the API', () => {
    todosActions.setFilter('completed');
    expect(todosStore.getState()).toStrictEqual({ filter: 'completed' });
  });
});
