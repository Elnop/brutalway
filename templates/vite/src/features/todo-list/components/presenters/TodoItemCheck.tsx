type TodoItemCheckProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function TodoItemCheck({ title, completed, onToggle }: TodoItemCheckProps) {
  return (
    <label className="todo-item-check">
      <input type="checkbox" checked={completed} onChange={onToggle} />
      <span>{title}</span>
    </label>
  );
}
