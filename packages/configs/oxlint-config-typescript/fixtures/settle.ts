export function settle(rows: number[][], limit: number, strict: boolean): number {
  let total = 0;
  for (const row of rows) {
    for (const cell of row) {
      if (cell > limit) {
        if (strict && cell % 2 === 0) {
          total -= cell;
        } else if (!strict || cell > limit * 2) {
          total += cell > 100 ? 100 : cell;
        }
      } else if (cell < 0 && (strict || limit > 10)) {
        total += 1;
      }
    }
  }
  return total;
}
