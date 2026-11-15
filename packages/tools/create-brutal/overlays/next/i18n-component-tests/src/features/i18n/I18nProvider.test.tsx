import { useTranslation } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { createI18n } from '@/features/i18n/createI18n.ts';
import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';

function Title() {
  const { t } = useTranslation('app');
  return <p>{t('title')}</p>;
}

describe('I18nProvider', () => {
  it('hands the messages of the language of the request to the components it renders', async () => {
    const title = createI18n('fr').getFixedT(null, 'app')('title');
    const screen = await render(
      <I18nProvider language="fr">
        <Title />
      </I18nProvider>,
    );
    await expect.element(screen.getByText(title)).toBeVisible();
  });
});
