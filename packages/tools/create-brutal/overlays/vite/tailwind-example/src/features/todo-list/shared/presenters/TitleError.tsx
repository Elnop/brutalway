type TitleErrorProps = {
  id: string;
  error: string | undefined;
};

export function TitleError({ id, error }: TitleErrorProps) {
  if (error === undefined) return null;
  return (
    <p id={`${id}-error`} role="alert" className="basis-full border-3 border-ink bg-pink px-[0.6rem] py-[0.2rem] font-bold text-on-accent">
      {error}
    </p>
  );
}
