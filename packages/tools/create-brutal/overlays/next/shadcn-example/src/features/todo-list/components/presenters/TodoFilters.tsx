import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  const { t } = useTranslation('todoList');
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t('show')}>
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
          {t(`filters.${value}`)}
        </Button>
      ))}
    </div>
  );
}
