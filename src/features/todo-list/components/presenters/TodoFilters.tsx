import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  return (
    <div className="todo-filters" role="group" aria-label="Show">
      {TODO_FILTERS.map(({ value, label }) => (
        <button key={value} type="button" className="button button-small" aria-pressed={filter === value} onClick={() => onChange(value)}>
          {label}
        </button>
      ))}
    </div>
  );
}
