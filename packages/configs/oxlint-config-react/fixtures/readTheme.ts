export function readTheme(): string | null {
  return localStorage.getItem('theme');
}
