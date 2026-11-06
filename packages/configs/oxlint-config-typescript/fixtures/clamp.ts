type Counter = { next(): number };

export function clamp(value: number, values: number[], counter: Counter) {
  value = Math.max(counter.next(), value);
  values.forEach((item) => item);
  return /a/.test(String(value)) ? 1 : value > 2 ? 2 : 3;
}
