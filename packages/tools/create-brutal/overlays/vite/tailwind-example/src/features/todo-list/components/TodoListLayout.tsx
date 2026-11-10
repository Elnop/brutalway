import { useTranslation } from 'react-i18next';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';

export function TodoListLayout() {
  const { t } = useTranslation('todoList');
  const list = useTodoList();
  return (
    <section className="border-3 border-ink bg-yellow p-6 text-on-accent shadow-hard" aria-labelledby="todo-list-title">
      <h2 id="todo-list-title" className="mb-5 font-display text-2xl leading-none font-bold uppercase">
        {t('title')}
      </h2>
      <TodoInput onAdd={list.add} />
      <TodoFilters filter={list.filter} onChange={list.setFilter} />
      <TodoItems todos={list.todos} onToggle={list.toggle} onRename={list.rename} onRemove={list.remove} />
    </section>
  );
}
