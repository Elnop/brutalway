import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/shared/Button.tsx';
import { THEME } from '@/shared/ThemeConfig.ts';
import { TODO_FILTERS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

type TodoFiltersProps = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  const { t } = useTranslation('todoList');
  return (
    <View role="group" aria-label={t('show')} style={styles.filters}>
      {TODO_FILTERS.map((value) => (
        <Button
          key={value}
          label={t(`filters.${value}`)}
          small
          aria-selected={filter === value}
          onPress={() => onChange(value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.s,
    marginBottom: THEME.spacing.l,
  },
});
