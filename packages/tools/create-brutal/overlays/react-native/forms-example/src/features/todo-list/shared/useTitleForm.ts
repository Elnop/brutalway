import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TITLE_ERRORS } from '@/shared-features/todos/TodosConfig.ts';
import { TodoDraftSchema } from '@/shared-features/todos/TodosSchemas.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

function titleError(message: string | undefined): (typeof TITLE_ERRORS)[number] | undefined {
  return TITLE_ERRORS.find((key) => key === message);
}

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
  const { t } = useTranslation('todoList');
  const form = useForm({
    resolver: zodResolver(TodoDraftSchema),
    defaultValues: { title: initialTitle },
  });
  const { field } = useController({ control: form.control, name: 'title' });

  function submit() {
    void form.handleSubmit(({ title }) => {
      onSubmit(title);
      if (clearOnSubmit) form.reset({ title: '' });
    })();
  }

  const error = titleError(form.formState.errors.title?.message);
  return {
    field: {
      value: field.value,
      onChangeText: field.onChange,
      onBlur: field.onBlur,
      onSubmitEditing: submit,
    },
    error: error === undefined ? undefined : t(`errors.${error}`),
    submit,
  };
}
