import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
import { Checkbox } from '@third-party/shadcn/checkbox';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItem({ todo, onToggle, onRename, onRemove }: TodoItemProps) {
  const { t } = useTranslation('todoList');
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] text-ink shadow-hard-sm">
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
    <li className="flex flex-wrap items-center gap-2 border-3 border-ink bg-paper px-3 py-[0.6rem] text-ink shadow-hard-sm">
      <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
        <Checkbox className="size-6 rounded-none" checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
        <span className={todo.completed ? 'line-through decoration-3' : undefined}>{todo.title}</span>
      </label>
      <Button type="button" variant="secondary" size="sm" aria-label={t('editTask', { title: todo.title })} onClick={() => setEditing(true)}>
        {t('edit')}
      </Button>
      <Button type="button" variant="destructive" size="sm" aria-label={t('deleteTask', { title: todo.title })} onClick={() => onRemove(todo.id)}>
        {t('delete')}
      </Button>
    </li>
  );
}
