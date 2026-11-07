export function savedTheme(): string | null {
  return localStorage.getItem('theme');
}

export function saveTheme(theme: string): void {
  localStorage.setItem('theme', theme);
}
