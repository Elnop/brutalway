import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { SubmitEvent } from 'react';
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

  function submit(event: SubmitEvent<HTMLFormElement>) {
    form
      .handleSubmit(({ title }) => {
        onSubmit(title);
        if (clearOnSubmit) form.reset({ title: '' });
      })(event)
      .catch(reportError);
  }

  return {
    field: form.register('title'),
    error: form.formState.errors.title?.message,
    submit,
  };
}
