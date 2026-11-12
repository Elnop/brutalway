import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { TitleError } from '@/features/todo-list/shared/presenters/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/presenters/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';
import { Button } from '@/shared-features/theme/Button.tsx';
import { THEME } from '@/shared-features/theme/ThemeConfig.ts';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const { t } = useTranslation('todoList');
  const form = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <View style={styles.editor}>
      <TitleInput label={t('rename', { title })} error={form.error} autoFocus {...form.field} />
      <Button label={t('save')} tone="blue" small onPress={form.submit} />
      <Button label={t('cancel')} small onPress={onCancel} />
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
