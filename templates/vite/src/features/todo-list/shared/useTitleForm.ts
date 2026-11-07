import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { normalizeTitle } from '@/shared/lib/normalizeTitle.ts';

type TitleFormOptions = {
  initialTitle: string;
  clearOnSubmit: boolean;
  onSubmit: (title: string) => void;
};

const BLANK_TITLE = 'The title is blank';

export function useTitleForm({ initialTitle, clearOnSubmit, onSubmit }: TitleFormOptions) {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | undefined>(undefined);

  function change(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setError(undefined);
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTitle(title);
    if (normalized === '') {
      setError(BLANK_TITLE);
      return;
    }
    onSubmit(normalized);
    if (clearOnSubmit) setTitle('');
  }

  return { field: { value: title, onChange: change }, error, submit };
}
