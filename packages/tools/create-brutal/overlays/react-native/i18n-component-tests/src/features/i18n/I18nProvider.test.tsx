import { describe, expect, it, jest } from '@jest/globals';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { createI18n } from '@/features/i18n/lib/createI18n.ts';
import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'fr' }] }));

function Title() {
  const { t } = useTranslation('app');
  return <Text>{t('title')}</Text>;
}

describe('I18nProvider', () => {
  it('starts in the language of the device when none is saved', async () => {
    await render(
      <I18nProvider>
        <Title />
      </I18nProvider>,
    );
    const title = createI18n('fr').getFixedT(null, 'app')('title');
    expect(await screen.findByText(title)).toBeOnTheScreen();
  });
});
