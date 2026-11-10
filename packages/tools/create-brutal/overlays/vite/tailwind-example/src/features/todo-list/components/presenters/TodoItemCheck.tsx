type TodoItemCheckProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function TodoItemCheck({ title, completed, onToggle }: TodoItemCheckProps) {
  return (
    <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
      <span className="relative flex size-6 flex-none">
        <input type="checkbox" className="peer size-6 cursor-pointer appearance-none border-3 border-ink bg-paper text-ink checked:bg-yellow" checked={completed} onChange={onToggle} />
        <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 fill-none stroke-on-accent stroke-[2.5] peer-checked:block">
          <path d="M3 8l3 3 7-7" />
        </svg>
      </span>
      <span className={completed ? 'line-through decoration-3' : undefined}>{title}</span>
    </label>
  );
}
