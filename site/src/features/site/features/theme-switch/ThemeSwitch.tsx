import { THEME_OPTIONS } from '@/features/site/features/theme-switch/ThemesConfig.ts';
import { useThemeChoice } from '@/features/site/features/theme-switch/useThemeChoice.ts';
import '@/features/site/features/theme-switch/theme-switch.css';

export function ThemeSwitch() {
  const { choice, choose } = useThemeChoice();
  return (
    <div role="group" aria-label="Theme" className="theme-switch">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === choice}
          onClick={() => choose(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
