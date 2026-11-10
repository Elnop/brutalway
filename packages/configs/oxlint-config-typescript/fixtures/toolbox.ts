function first(values: number[]): number {
  return values[0] ?? 0;
}

function second(values: number[]): number {
  return values[1] ?? 0;
}

function third(values: number[]): number {
  return values[2] ?? 0;
}

function fourth(values: number[]): number {
  return values[3] ?? 0;
}

function fifth(values: number[]): number {
  return values[4] ?? 0;
}

export function toolbox(values: number[]): number[] {
  function sum(): number {
    return values.reduce((total, value) => total + value, 0);
  }
  return [first(values), second(values), third(values), fourth(values), fifth(values), sum()];
}
