import { StyleSheet, View } from 'react-native';
import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';
import { Button } from '@/shared/theme/Button.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { field, error, submit } = useTitleForm({
    initialTitle: '',
    clearOnSubmit: true,
    onSubmit: onAdd,
  });

  return (
    <View style={styles.form}>
      <TitleInput
        label="New task"
        error={error}
        placeholder="What needs doing?"
        autoComplete="off"
        {...field}
      />
      <Button label="Add" tone="yellow" onPress={submit} />
      <TitleError error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.m,
    marginBottom: THEME.spacing.l,
  },
});
