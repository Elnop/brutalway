import { Checkbox } from '@third-party/shadcn/checkbox';

type TodoItemCheckProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function TodoItemCheck({ title, completed, onToggle }: TodoItemCheckProps) {
  return (
    <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
      <Checkbox className="size-6 rounded-none" checked={completed} onCheckedChange={onToggle} />
      <span className={completed ? 'line-through decoration-3' : undefined}>{title}</span>
    </label>
  );
}
