import { useMemo } from 'react';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import { selectVisibleTodos } from '@/shared-features/todos/todosSelectors.ts';
import { todosActions } from '@/shared-features/todos/todosStore.ts';
import { useTodos } from '@/shared-features/todos/useTodos.ts';
import styles from '@/features/todo-list/components/TodoListLayout.module.css';

export function TodoListLayout() {
  const allTodos = useTodos((state) => state.todos);
  const filter = useTodos((state) => state.filter);
  const todos = useMemo(() => selectVisibleTodos({ todos: allTodos, filter }), [allTodos, filter]);
  return (
    <section className={styles.list} aria-labelledby="todo-list-title">
      <h2 id="todo-list-title">Tasks</h2>
      <TodoInput onAdd={todosActions.add} />
      <TodoFilters filter={filter} onChange={todosActions.setFilter} />
      {todos.length === 0 ? (
        <p className={styles.empty}>Nothing here.</p>
      ) : (
        <ul className={styles.items}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={todosActions.toggle} onRename={todosActions.rename} onRemove={todosActions.remove} />
          ))}
        </ul>
      )}
    </section>
  );
}
