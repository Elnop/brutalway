import { jest } from '@jest/globals';
import { setI18n } from 'react-i18next';
import { createI18n } from '@/app/createI18n.ts';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

setI18n(createI18n());
