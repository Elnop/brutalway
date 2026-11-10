import { useState } from 'react';
import { TodoItemActions } from '@/features/todo-list/components/presenters/TodoItemActions.tsx';
import { TodoItemCheck } from '@/features/todo-list/components/presenters/TodoItemCheck.tsx';
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

  function save(title: string) {
    onRename(todo.id, title);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] text-ink shadow-hard-sm">
        <TodoEditor title={todo.title} onSave={save} onCancel={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] text-ink shadow-hard-sm">
      <TodoItemCheck title={todo.title} completed={todo.completed} onToggle={() => onToggle(todo.id)} />
      <TodoItemActions title={todo.title} onEdit={() => setEditing(true)} onRemove={() => onRemove(todo.id)} />
    </li>
  );
}
