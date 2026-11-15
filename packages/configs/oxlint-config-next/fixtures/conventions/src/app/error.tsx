'use client';

type ErrorProps = { error: Error; reset: () => void };

export default function ErrorScreen({ error, reset }: ErrorProps) {
  return (
    <button type="button" onClick={reset}>
      {error.message}
    </button>
  );
}
