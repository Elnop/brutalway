import { useCounter } from './useCounter.ts';

export function BoardLayout() {
  const count = useCounter();
  return <p>{count.toFixed(0)}</p>;
}
