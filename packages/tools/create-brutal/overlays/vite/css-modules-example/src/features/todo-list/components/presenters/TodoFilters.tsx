import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';
import styles from '@/features/todo-list/components/presenters/TodoFilters.module.css';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  return (
    <div className={styles.filters} role="group" aria-label="Show">
      {TODO_FILTERS.map(({ value, label }) => (
        <button key={value} type="button" className="button button-small" aria-pressed={filter === value} onClick={() => onChange(value)}>
          {label}
        </button>
      ))}
    </div>
  );
}
