import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@third-party/shadcn/card';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';

export function TodoListLayout() {
  const { t } = useTranslation('todoList');
  const { todos, filter, add, setFilter, toggle, rename, remove } = useTodoList();
  return (
    <section aria-labelledby="todo-list-title">
      <Card className="bg-yellow text-on-accent shadow-hard">
        <CardHeader>
          <h2 id="todo-list-title" className="font-display text-2xl leading-none font-bold uppercase">
            {t('title')}
          </h2>
        </CardHeader>
        <CardContent>
          <TodoInput onAdd={add} />
          <TodoFilters filter={filter} onChange={setFilter} />
          {todos.length === 0 ? (
            <p className="font-bold">{t('empty')}</p>
          ) : (
            <ul className="grid gap-3">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggle} onRename={rename} onRemove={remove} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
