import { StyleSheet, View } from 'react-native';
import { Button } from '@/shared/theme/Button.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';
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
    <View role="group" aria-label="Show" style={styles.filters}>
      {TODO_FILTERS.map((value) => (
        <Button
          key={value}
          label={FILTER_LABELS[value]}
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
