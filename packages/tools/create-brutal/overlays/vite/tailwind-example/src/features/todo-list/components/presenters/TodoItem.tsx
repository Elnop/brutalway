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
      <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] shadow-hard-sm">
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
    <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] shadow-hard-sm">
      <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
        <span className="relative flex size-6 flex-none">
          <input type="checkbox" className="peer size-6 cursor-pointer appearance-none border-3 border-ink bg-paper checked:bg-ink" checked={todo.completed} onChange={() => onToggle(todo.id)} />
          <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 fill-none stroke-yellow stroke-[2.5] peer-checked:block">
            <path d="M3 8l3 3 7-7" />
          </svg>
        </span>
        <span className={todo.completed ? 'line-through decoration-3' : undefined}>{todo.title}</span>
      </label>
      <button type="button" className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem]" aria-label={`Edit ${todo.title}`} onClick={() => setEditing(true)}>
        Edit
      </button>
      <button type="button" className="button bg-pink px-[0.7rem] py-[0.3rem] text-[0.9rem]" aria-label={`Delete ${todo.title}`} onClick={() => onRemove(todo.id)}>
        Delete
      </button>
    </li>
  );
}
