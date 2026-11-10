export function nest(grid: number[][][]): number[][][] {
  return grid.map((plane) => plane.map((row) => row.map((cell) => [cell].map((value) => value * 2)[0] ?? 0)));
}
