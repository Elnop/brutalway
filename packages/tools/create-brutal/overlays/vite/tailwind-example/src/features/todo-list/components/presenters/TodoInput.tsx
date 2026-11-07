import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { normalizeTitle } from '@/shared/lib/normalizeTitle.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const blank = normalizeTitle(title) === '';

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blank) return;
    onAdd(title);
    setTitle('');
  }

  return (
    <form className="mb-5 flex gap-3" onSubmit={submit}>
      <label htmlFor="new-todo" className="sr-only">
        New task
      </label>
      <input
        id="new-todo"
        className="min-w-0 flex-1 border-3 border-ink bg-paper px-3 py-[0.55rem]"
        placeholder="What needs doing?"
        autoComplete="off"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit" className="button bg-yellow px-[1.1rem] py-[0.55rem]" disabled={blank}>
        Add
      </button>
    </form>
  );
}
