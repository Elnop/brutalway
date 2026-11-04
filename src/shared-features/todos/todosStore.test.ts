import { beforeEach, describe, expect, it } from 'vitest';
import { STARTER_TODOS } from '@/shared-features/todos/TodosConfig.ts';
import { todosActions, todosStore } from '@/shared-features/todos/todosStore.ts';

describe('todosActions', () => {
  beforeEach(() => {
    todosStore.setState({ todos: STARTER_TODOS, filter: 'all' });
  });

  it('adds a normalized todo and ignores a blank one', () => {
    todosActions.add('  ship   it ');
    todosActions.add('   ');
    expect(todosStore.getState().todos.map((todo) => todo.title)).toStrictEqual(['Read the README', 'Run npm run check', 'Write your first feature', 'ship it']);
  });

  it('toggles, renames, removes and clears completed todos', () => {
    todosActions.toggle('run-the-checks');
    todosActions.rename('write-a-feature', ' Write two features ');
    todosActions.rename('write-a-feature', ' ');
    todosActions.remove('read-the-readme');
    expect(todosStore.getState().todos).toStrictEqual([
      { id: 'run-the-checks', title: 'Run npm run check', completed: true },
      { id: 'write-a-feature', title: 'Write two features', completed: false },
    ]);
    todosActions.clearCompleted();
    expect(todosStore.getState().todos.map((todo) => todo.id)).toStrictEqual(['write-a-feature']);
  });
});
