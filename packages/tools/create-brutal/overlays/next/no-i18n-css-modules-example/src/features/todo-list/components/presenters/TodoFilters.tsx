import { TODO_FILTERS } from '@/shared/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared/todos/TodosTypes.ts';
import styles from '@/features/todo-list/components/presenters/TodoFilters.module.css';

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
    <div className={styles.filters} role="group" aria-label="Show">
      {TODO_FILTERS.map((value) => (
        <button
          key={value}
          type="button"
          className="button button-small"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
        >
          {FILTER_LABELS[value]}
        </button>
      ))}
    </div>
  );
}
