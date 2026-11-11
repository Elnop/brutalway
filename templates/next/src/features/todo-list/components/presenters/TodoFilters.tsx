import { useTranslation } from 'react-i18next';
import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  const { t } = useTranslation('todoList');
  return (
    <div className="todo-filters" role="group" aria-label={t('show')}>
      {TODO_FILTERS.map((value) => (
        <button
          key={value}
          type="button"
          className="button button-small"
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
        >
          {t(`filters.${value}`)}
        </button>
      ))}
    </div>
  );
}
