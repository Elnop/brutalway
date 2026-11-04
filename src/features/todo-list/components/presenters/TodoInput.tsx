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
    <form className="todo-input" onSubmit={submit}>
      <label htmlFor="new-todo" className="visually-hidden">
        New task
      </label>
      <input id="new-todo" placeholder="What needs doing?" autoComplete="off" value={title} onChange={(event) => setTitle(event.target.value)} />
      <button type="submit" className="button button-yellow" disabled={blank}>
        Add
      </button>
    </form>
  );
}
