import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import type { Todo } from '@/shared/todos/TodosTypes.ts';

type TodoItemsProps = {
  todos: Todo[];
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItems({ todos, onToggle, onRename, onRemove }: TodoItemsProps) {
  if (todos.length === 0) return <p className="font-bold">Nothing here.</p>;
  return (
    <ul className="grid gap-3">
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
