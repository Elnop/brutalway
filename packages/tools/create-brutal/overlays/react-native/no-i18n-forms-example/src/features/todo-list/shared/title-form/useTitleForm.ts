import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import { TodoDraftSchema } from '@/shared/todos/TodosSchemas.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
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

  return {
    field: {
      value: field.value,
      onChangeText: field.onChange,
      onBlur: field.onBlur,
      onSubmitEditing: submit,
    },
    error: form.formState.errors.title?.message,
    submit,
  };
}
