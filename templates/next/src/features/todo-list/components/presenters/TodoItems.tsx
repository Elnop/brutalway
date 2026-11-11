import { useTranslation } from 'react-i18next';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemsProps = {
  todos: Todo[];
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItems({ todos, onToggle, onRename, onRemove }: TodoItemsProps) {
  const { t } = useTranslation('todoList');

  if (todos.length === 0) return <p className="todo-list-empty">{t('empty')}</p>;
  return (
    <ul className="todo-list-items">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
