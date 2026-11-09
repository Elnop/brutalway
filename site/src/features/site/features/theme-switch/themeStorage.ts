import { THEME_STORAGE_KEY } from '@/features/site/features/theme-switch/ThemesConfig.ts';
import type { ThemeChoice } from '@/features/site/features/theme-switch/ThemeTypes.ts';

export function readThemeChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function writeThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    return;
  }
}
