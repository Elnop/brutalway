import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemCheckProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
};

export function TodoItemCheck({ todo, onToggle }: TodoItemCheckProps) {
  return (
    <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
      <span className="relative flex size-6 flex-none">
        <input
          type="checkbox"
          className="peer size-6 cursor-pointer appearance-none border-3 border-ink bg-paper text-ink checked:bg-yellow"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 fill-none stroke-on-accent stroke-[2.5] peer-checked:block"
        >
          <path d="M3 8l3 3 7-7" />
        </svg>
      </span>
      <span className={todo.completed ? 'line-through decoration-3' : undefined}>{todo.title}</span>
    </label>
  );
}
