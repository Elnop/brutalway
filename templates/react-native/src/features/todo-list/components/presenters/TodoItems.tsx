import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemsProps = {
  todos: Todo[];
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItems({ todos, onToggle, onRename, onRemove }: TodoItemsProps) {
  const { t } = useTranslation('todoList');

  if (todos.length === 0) return <Text style={styles.empty}>{t('empty')}</Text>;
  return (
    <View role="list" style={styles.items}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onRemove={onRemove}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  items: { gap: THEME.spacing.m },
  empty: {
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
  },
});
