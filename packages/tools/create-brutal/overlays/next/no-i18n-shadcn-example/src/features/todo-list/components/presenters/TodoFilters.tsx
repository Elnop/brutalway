import { Button } from '@third-party/shadcn/button';
import { TODO_FILTERS } from '@/shared/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared/todos/TodosTypes.ts';

const FILTER_LABELS: Record<TodoFilter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Done',
};

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Show">
      {TODO_FILTERS.map((value) => (
        <Button
          key={value}
          type="button"
          variant="secondary"
          size="sm"
          className="aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
        >
          {FILTER_LABELS[value]}
        </Button>
      ))}
    </div>
  );
}
