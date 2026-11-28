import { createInstance } from 'i18next';
import type { i18n } from 'i18next';
import app from '@/app/locales/en/app.json';
import todoList from '@/features/todo-list/locales/en/todoList.json';
import todoStats from '@/features/todo-stats/locales/en/todoStats.json';

export function createI18n(language = 'en'): i18n {
  const instance = createInstance({
    lng: language,
    fallbackLng: 'en',
    defaultNS: 'app',
    resources: {
      en: { app, todoList, todoStats },
    },
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  void instance.init();
  return instance;
}
