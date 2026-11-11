'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@third-party/shadcn/card';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';

function TodoListTitle() {
  const { t } = useTranslation('todoList');
  return (
    <CardHeader>
      <h2 id="todo-list-title" className="font-display text-2xl leading-none font-bold uppercase">
        {t('title')}
      </h2>
    </CardHeader>
  );
}

export function TodoListLayout() {
  const list = useTodoList();
  return (
    <section aria-labelledby="todo-list-title">
      <Card className="bg-yellow text-on-accent shadow-hard">
        <TodoListTitle />
        <CardContent>
          <TodoInput onAdd={list.add} />
          <TodoFilters filter={list.filter} onChange={list.setFilter} />
          <TodoItems
            todos={list.todos}
            onToggle={list.toggle}
            onRename={list.rename}
            onRemove={list.remove}
          />
        </CardContent>
      </Card>
    </section>
  );
}
