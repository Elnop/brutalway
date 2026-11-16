import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItems } from '@/features/todo-list/components/presenters/TodoItems.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

export function TodoListLayout() {
  const { t } = useTranslation('todoList');
  const list = useTodoList();
  return (
    <View style={styles.card}>
      <Text role="heading" style={styles.title}>
        {t('title')}
      </Text>
      <TodoInput onAdd={list.add} />
      <TodoFilters filter={list.filter} onChange={list.setFilter} />
      <TodoItems
        todos={list.todos}
        onToggle={list.toggle}
        onRename={list.rename}
        onRemove={list.remove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...THEME.border,
    padding: THEME.spacing.l,
    backgroundColor: THEME.colors.yellow,
    boxShadow: THEME.shadows.large,
  },
  title: {
    marginBottom: THEME.spacing.l,
    color: THEME.colors.onAccent,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.heading,
    textTransform: 'uppercase',
  },
});
