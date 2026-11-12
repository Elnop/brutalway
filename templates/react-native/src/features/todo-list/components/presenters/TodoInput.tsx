import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { TitleError } from '@/features/todo-list/shared/presenters/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/presenters/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';
import { Button } from '@/shared-features/theme/Button.tsx';
import { THEME } from '@/shared-features/theme/ThemeConfig.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { t } = useTranslation('todoList');
  const { field, error, submit } = useTitleForm({
    initialTitle: '',
    clearOnSubmit: true,
    onSubmit: onAdd,
  });

  return (
    <View style={styles.form}>
      <TitleInput
        label={t('newTask')}
        error={error}
        placeholder={t('placeholder')}
        autoComplete="off"
        {...field}
      />
      <Button label={t('add')} tone="yellow" onPress={submit} />
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
