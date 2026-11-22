import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@/app/globals.css';
import { App } from '@/app/App.tsx';
import { createI18n } from '@/features/i18n/createI18n.ts';
import { QueryProvider } from '@/features/query-client/QueryProvider.tsx';

const i18n = createI18n();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryProvider>
        <App />
      </QueryProvider>
    </I18nextProvider>
  </StrictMode>,
);
