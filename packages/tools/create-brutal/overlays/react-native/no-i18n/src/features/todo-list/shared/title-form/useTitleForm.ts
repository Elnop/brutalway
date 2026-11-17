import { useState } from 'react';
import { normalizeTitle } from '@/shared/todos/lib/normalizeTitle.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
  const [title, setTitle] = useState(initialTitle);
  const [blank, setBlank] = useState(false);

  function change(text: string) {
    setTitle(text);
    setBlank(false);
  }

  function submit() {
    const normalized = normalizeTitle(title);
    if (normalized === '') {
      setBlank(true);
      return;
    }
    onSubmit(normalized);
    if (clearOnSubmit) setTitle('');
  }

  return {
    field: { value: title, onChangeText: change, onSubmitEditing: submit },
    error: blank ? 'The title is blank' : undefined,
    submit,
  };
}
