import styles from '@/features/todo-list/components/presenters/TodoItemCheck.module.css';

type TodoItemCheckProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function TodoItemCheck({ title, completed, onToggle }: TodoItemCheckProps) {
  return (
    <label className={completed ? `${styles.check} ${styles.done}` : styles.check}>
      <input type="checkbox" checked={completed} onChange={onToggle} />
      <span>{title}</span>
    </label>
  );
}
