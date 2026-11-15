import { describe, expect, it } from '@jest/globals';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { createI18n } from '@/features/i18n/createI18n.ts';
import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';

function Title() {
  const { t } = useTranslation('app');
  return <Text>{t('title')}</Text>;
}

describe('I18nProvider', () => {
  it('hands the messages to the components it renders', async () => {
    const title = createI18n().getFixedT(null, 'app')('title');
    await render(
      <I18nProvider>
        <Title />
      </I18nProvider>,
    );
    expect(screen.getByText(title)).toBeOnTheScreen();
  });
});
