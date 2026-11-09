import { useLayoutEffect, useState } from 'react';
import { readThemeChoice, writeThemeChoice } from '@/features/site/features/theme-switch/themeStorage.ts';
import type { ThemeChoice } from '@/features/site/features/theme-switch/ThemeTypes.ts';

export function useThemeChoice(): { choice: ThemeChoice; choose: (choice: ThemeChoice) => void } {
  const [choice, setChoice] = useState(readThemeChoice);
  useLayoutEffect(() => {
    if (choice === 'system') delete document.documentElement.dataset['theme'];
    else document.documentElement.dataset['theme'] = choice;
  }, [choice]);
  function choose(next: ThemeChoice): void {
    writeThemeChoice(next);
    setChoice(next);
  }
  return { choice, choose };
}
