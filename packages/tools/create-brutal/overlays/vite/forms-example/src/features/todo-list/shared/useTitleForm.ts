import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SubmitEvent } from 'react';
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
  const { register, handleSubmit, reset, formState } = useForm({ resolver: zodResolver(TodoDraftSchema), defaultValues: { title: initialTitle } });

  function submit(event: SubmitEvent<HTMLFormElement>) {
    handleSubmit(({ title }) => {
      onSubmit(title);
      if (clearOnSubmit) reset({ title: '' });
    })(event).catch(reportError);
  }

  const error = titleError(formState.errors.title?.message);
  return { field: register('title'), error: error === undefined ? undefined : t(`errors.${error}`), submit };
}
