import { useTranslation } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { I18nProvider } from '@/app/I18nProvider.tsx';

function Title() {
  const { t } = useTranslation('app');
  return <p>{t('title')}</p>;
}

describe('I18nProvider', () => {
  it('hands the messages of the language of the request to the components it renders', async () => {
    const screen = await render(
      <I18nProvider language="fr">
        <Title />
      </I18nProvider>,
    );
    await expect.element(screen.getByText('Tâches')).toBeVisible();
  });
});
