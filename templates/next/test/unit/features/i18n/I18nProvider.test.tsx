import { useTranslation } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';
import app from '@locales/en/app.json';

function Title() {
  const { t } = useTranslation('app');
  return <p>{t('title')}</p>;
}

describe('I18nProvider', () => {
  it('hands the messages to the components it renders', async () => {
    const screen = await render(
      <I18nProvider>
        <Title />
      </I18nProvider>,
    );
    await expect.element(screen.getByText(app.title)).toBeVisible();
  });
});
