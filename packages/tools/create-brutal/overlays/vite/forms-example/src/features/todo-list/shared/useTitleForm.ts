import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { SubmitEvent } from 'react';
import { TodoDraftSchema } from '@/shared-features/todos/TodosSchemas.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(TodoDraftSchema), defaultValues: { title: initialTitle } });

  function submit(event: SubmitEvent<HTMLFormElement>) {
    handleSubmit(({ title }) => {
      onSubmit(title);
      if (clearOnSubmit) reset({ title: '' });
    })(event).catch(reportError);
  }

  return { field: register('title'), error: formState.errors.title?.message, submit };
}
