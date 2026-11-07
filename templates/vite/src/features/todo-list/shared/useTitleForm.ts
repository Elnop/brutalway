import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeTitle } from '@/shared/normalizeTitle.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
  const { t } = useTranslation('todoList');
  const [title, setTitle] = useState(initialTitle);
  const [blank, setBlank] = useState(false);

  function change(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setBlank(false);
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTitle(title);
    if (normalized === '') {
      setBlank(true);
      return;
    }
    onSubmit(normalized);
    if (clearOnSubmit) setTitle('');
  }

  return { field: { value: title, onChange: change }, error: blank ? t('errors.blankTitle') : undefined, submit };
}
