import { useTranslation } from 'react-i18next';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';
import styles from '@/features/todo-list/components/TodoListLayout.module.css';

export function TodoListLayout() {
  const { t } = useTranslation('todoList');
  const { todos, filter, add, setFilter, toggle, rename, remove } = useTodoList();
  return (
    <section className={styles.list} aria-labelledby="todo-list-title">
      <h2 id="todo-list-title">{t('title')}</h2>
      <TodoInput onAdd={add} />
      <TodoFilters filter={filter} onChange={setFilter} />
      <TodoItems todos={todos} onToggle={toggle} onRename={rename} onRemove={remove} />
    </section>
  );
}
