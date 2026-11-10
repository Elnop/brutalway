export function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
