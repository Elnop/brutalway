import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';
import styles from '@/features/todo-list/components/presenters/TodoItem.module.css';

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
      <li className={styles.item}>
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
    <li className={todo.completed ? `${styles.item} ${styles.done}` : styles.item}>
      <label className={styles.check}>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span>{todo.title}</span>
      </label>
      <button type="button" className="button button-small" aria-label={t('editTask', { title: todo.title })} onClick={() => setEditing(true)}>
        {t('edit')}
      </button>
      <button type="button" className="button button-small button-pink" aria-label={t('deleteTask', { title: todo.title })} onClick={() => onRemove(todo.id)}>
        {t('delete')}
      </button>
    </li>
  );
}
