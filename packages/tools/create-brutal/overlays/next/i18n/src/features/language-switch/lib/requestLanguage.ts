import { cookies, headers } from 'next/headers';
import { LANGUAGE_COOKIE } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';
import { pickLanguage } from '@/features/language-switch/lib/pickLanguage.ts';

export async function requestLanguage(): Promise<Language> {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return pickLanguage(saved, (await headers()).get('accept-language') ?? '');
}
