import type { ThemeOption } from '@/features/site/features/theme-switch/ThemeTypes.ts';

export const THEME_STORAGE_KEY = 'brutalway-theme';

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'system', label: 'Auto' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];
