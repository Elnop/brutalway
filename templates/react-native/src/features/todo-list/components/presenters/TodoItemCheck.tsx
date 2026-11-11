import { Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/shared/ThemeConfig.ts';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemCheckProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
};

export function TodoItemCheck({ todo, onToggle }: TodoItemCheckProps) {
  return (
    <Pressable
      role="checkbox"
      aria-checked={todo.completed}
      aria-label={todo.title}
      style={styles.check}
      onPress={() => onToggle(todo.id)}
    >
      <View style={[styles.box, todo.completed && styles.boxChecked]}>
        {todo.completed && <Text style={styles.tick}>✓</Text>}
      </View>
      <Text style={[styles.title, todo.completed && styles.titleDone]}>{todo.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  check: {
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: THEME.sizes.field,
    gap: THEME.spacing.m,
    alignItems: 'center',
  },
  box: {
    ...THEME.border,
    width: THEME.sizes.checkbox,
    height: THEME.sizes.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.paper,
  },
  boxChecked: { backgroundColor: THEME.colors.yellow },
  tick: {
    color: THEME.colors.onAccent,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.small,
  },
  title: {
    flexShrink: 1,
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
  },
  titleDone: { textDecorationLine: 'line-through' },
});
