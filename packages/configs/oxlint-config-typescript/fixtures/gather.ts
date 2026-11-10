export function gather(rows: string[][]): string {
  const [first, second] = rows;
  const { length } = rows;
  const head = first?.[0] ?? '';
  const tail = second?.[0] ?? '';
  const joined = `${head}${tail}`;
  return `${joined}${length}`;
}

export function spread(values: number[]): number[] {
  const total = values.length;
  const offset = 1;
  return values.map((value) => {
    const doubled = value * 2;
    const shifted = doubled + offset;
    const scaled = shifted * total;
    const rounded = Math.round(scaled);
    return rounded;
  });
}
