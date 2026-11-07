import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Show">
      {TODO_FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
