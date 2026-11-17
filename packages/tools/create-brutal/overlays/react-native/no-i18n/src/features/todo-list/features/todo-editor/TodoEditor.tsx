import { StyleSheet, View } from 'react-native';
import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';
import { Button } from '@/shared/theme/Button.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const form = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <View style={styles.editor}>
      <TitleInput label={`Rename ${title}`} error={form.error} autoFocus {...form.field} />
      <Button label="Save" tone="blue" small onPress={form.submit} />
      <Button label="Cancel" small onPress={onCancel} />
      <TitleError error={form.error} />
    </View>
  );
}

const styles = StyleSheet.create({
  editor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    gap: THEME.spacing.s,
  },
});
