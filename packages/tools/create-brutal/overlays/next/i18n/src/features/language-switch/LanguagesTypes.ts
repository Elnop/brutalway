import type { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';

export type Language = (typeof LANGUAGES)[number];
