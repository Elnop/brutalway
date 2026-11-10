export function blend(red: number, green: number, blue: number, alpha: number, gamma: number): number {
  return (red + green + blue) * alpha * gamma;
}
