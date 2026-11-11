'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from '@/app/createI18n.ts';

type I18nProviderProps = { language: string; children: ReactNode };

export function I18nProvider({ language, children }: I18nProviderProps) {
  const [i18n] = useState(() => createI18n(language));
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
