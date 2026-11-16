type TitleErrorProps = {
  id: string;
  error: string | undefined;
};

export function TitleError({ id, error }: TitleErrorProps) {
  if (error === undefined) return null;
  return (
    <p id={`${id}-error`} role="alert" className="field-error">
      {error}
    </p>
  );
}
