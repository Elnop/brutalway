import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TodoItemActions } from '@/features/todo-list/components/presenters/TodoItemActions.tsx';
import { TodoItemCheck } from '@/features/todo-list/components/presenters/TodoItemCheck.tsx';
import { TodoEditor } from '@/features/todo-list/features/todo-editor/TodoEditor.tsx';
import { THEME } from '@/shared/ThemeConfig.ts';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
  onRename: (id: Todo['id'], title: string) => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItem({ todo, onToggle, onRename, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false);

  function save(title: string) {
    onRename(todo.id, title);
    setEditing(false);
  }

  if (editing) {
    return (
      <View role="listitem" style={styles.item}>
        <TodoEditor title={todo.title} onSave={save} onCancel={() => setEditing(false)} />
      </View>
    );
  }

  return (
    <View role="listitem" style={styles.item}>
      <TodoItemCheck todo={todo} onToggle={onToggle} />
      <TodoItemActions todo={todo} onEdit={() => setEditing(true)} onRemove={onRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    ...THEME.border,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.s,
    alignItems: 'center',
    paddingVertical: THEME.spacing.s,
    paddingHorizontal: THEME.spacing.m,
    backgroundColor: THEME.colors.paper,
    boxShadow: THEME.shadows.small,
  },
});
