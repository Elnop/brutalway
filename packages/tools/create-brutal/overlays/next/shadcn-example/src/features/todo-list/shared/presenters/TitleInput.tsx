import type { ComponentProps } from 'react';
import { Input } from '@third-party/shadcn/input';

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
      <Input
        id={id}
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : `${id}-error`}
        {...input}
      />
    </>
  );
}
