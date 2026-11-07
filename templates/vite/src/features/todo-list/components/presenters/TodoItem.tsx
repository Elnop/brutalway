import { useState } from 'react';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItem({ todo, onToggle, onRename, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="todo-item">
        <TodoEditor
          title={todo.title}
          onSave={(title) => {
            onRename(todo.id, title);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={todo.completed ? 'todo-item todo-item-done' : 'todo-item'}>
      <label className="todo-item-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span>{todo.title}</span>
      </label>
      <button type="button" className="button button-small" aria-label={`Edit ${todo.title}`} onClick={() => setEditing(true)}>
        Edit
      </button>
      <button type="button" className="button button-small button-pink" aria-label={`Delete ${todo.title}`} onClick={() => onRemove(todo.id)}>
        Delete
      </button>
    </li>
  );
}
