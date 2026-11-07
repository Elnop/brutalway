import { useTranslation } from 'react-i18next';
import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';
import styles from '@/features/todo-list/components/presenters/TodoFilters.module.css';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  const { t } = useTranslation('todoList');
  return (
    <div className={styles.filters} role="group" aria-label={t('show')}>
      {TODO_FILTERS.map((value) => (
        <button key={value} type="button" className="button button-small" aria-pressed={filter === value} onClick={() => onChange(value)}>
          {t(`filters.${value}`)}
        </button>
      ))}
    </div>
  );
}
