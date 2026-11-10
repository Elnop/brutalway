export function tally(values: number[]): string {
  const positives = values.filter((value) => value > 0);
  const negatives = values.filter((value) => value < 0);
  const zeros = values.filter((value) => value === 0);
  const sum = values.reduce((total, value) => total + value, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const mean = sum / values.length;
  const sorted = values.toSorted((left, right) => left - right);
  const median = sorted[Math.floor(sorted.length / 2)];
  const range = max - min;
  const lines = [
    `positives: ${positives.length}`,
    `negatives: ${negatives.length}`,
    `zeros: ${zeros.length}`,
    `sum: ${sum}`,
    `max: ${max}`,
    `min: ${min}`,
    `mean: ${mean}`,
    `median: ${median}`,
    `range: ${range}`,
  ];
  const header = 'tally';
  const footer = 'end';
  return [header, ...lines, footer].join('\n');
}
