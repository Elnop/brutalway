import type { FileEdit } from '#src/shared/stack/StackTypes.ts';

export function i18nLocaleEdits(createI18n: string): FileEdit[] {
  return [
    {
      file: 'src/app/locales/en/app.json',
      after: '{\n',
      insert: '  "language": "Language",\n  "languages": { "en": "English", "fr": "Français" },\n',
    },
    {
      file: createI18n,
      replace: '      en: {',
      with: '      fr: FRENCH,\n      en: {',
    },
    {
      file: 'i18next.config.ts',
      replace: "locales: ['en'],",
      with: "locales: ['en', 'fr'],",
    },
  ];
}
