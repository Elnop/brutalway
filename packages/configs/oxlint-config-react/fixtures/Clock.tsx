import { useEffect } from 'react';

type ClockProps = { start: number };

export function Clock({ start }: ClockProps) {
  useEffect(() => {
    document.title = String(start);
  }, []);
  return <p>{start}</p>;
}
