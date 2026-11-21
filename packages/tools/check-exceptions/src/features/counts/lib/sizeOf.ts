export function sizeOf(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'string') return 1;
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).reduce((total: number, entry) => total + sizeOf(entry), 0);
  }
  return 0;
}
