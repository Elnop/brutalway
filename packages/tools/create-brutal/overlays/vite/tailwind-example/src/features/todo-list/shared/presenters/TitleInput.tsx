import type { ComponentProps } from 'react';

type TitleInputProps = ComponentProps<'input'> & {
  id: string;
  label: string;
  error: string | undefined;
};

export function TitleInput({ id, label, error, ...input }: TitleInputProps) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} aria-invalid={error !== undefined} aria-describedby={error === undefined ? undefined : `${id}-error`} {...input} />
    </>
  );
}
