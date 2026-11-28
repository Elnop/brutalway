import { describe, expect, it } from 'vitest';
import { createI18n } from '@/app/createI18n.ts';

describe('createI18n', () => {
  it('starts in English, with the messages of locales/en/', () => {
    const i18n = createI18n();
    expect(i18n.language).toBe('en');
    expect(i18n.getFixedT(null, 'app')('title')).toBe('__PROJECT_NAME__');
  });

  it('falls back to English for a language the project does not have', () => {
    expect(createI18n('de').getFixedT(null, 'app')('title')).toBe('__PROJECT_NAME__');
  });
});
