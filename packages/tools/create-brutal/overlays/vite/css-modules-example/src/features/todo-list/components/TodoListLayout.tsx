import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';
import styles from '@/features/todo-list/components/TodoListLayout.module.css';

export function TodoListLayout() {
  const { todos, filter, add, setFilter, toggle, rename, remove } = useTodoList();
  return (
    <section className={styles.list} aria-labelledby="todo-list-title">
      <h2 id="todo-list-title">Tasks</h2>
      <TodoInput onAdd={add} />
      <TodoFilters filter={filter} onChange={setFilter} />
      {todos.length === 0 ? (
        <p className={styles.empty}>Nothing here.</p>
      ) : (
        <ul className={styles.items}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onRename={rename} onRemove={remove} />
          ))}
        </ul>
      )}
    </section>
  );
}
