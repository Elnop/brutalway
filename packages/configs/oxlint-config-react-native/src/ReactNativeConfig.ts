import { reactConfig } from '@brutalway/oxlint-config-react';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';
import { jestRules } from '#src/features/jest/JestConfig.ts';
import { reactNativePluginRules } from '#src/features/react-native-plugin/ReactNativePluginConfig.ts';
import { routeFilesOverrides } from '#src/features/route-files/RouteFilesConfig.ts';
import { themeStylesRules } from '#src/features/theme-styles/ThemeStylesConfig.ts';

export const reactNativeConfig: OxlintConfig = defineConfig({
  extends: [reactConfig, zustandConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn', 'jest'],
  jsPlugins: [
    {
      name: 'theme-styles',
      specifier: fileURLToPath(new URL('./themeStylesPlugin.js', import.meta.url)),
    },
    {
      name: 'react-native',
      specifier: fileURLToPath(import.meta.resolve('eslint-plugin-react-native')),
    },
  ],
  env: { browser: true, es2024: true },
  ignorePatterns: ['.expo', 'android', 'ios', 'dist', 'expo-env.d.ts'],
  rules: {
    ...themeStylesRules,
    ...reactNativePluginRules,
    ...jestRules,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'Relative imports are not allowed: import through an alias.',
          },
        ],
      },
    ],
    'import/default': 'off',
    'typescript/no-non-null-assertion': 'off',
  },
  overrides: [
    ...routeFilesOverrides,
    { files: ['**/*.config.ts', '**/*.config.js', 'jest.setup.ts'], env: { node: true } },
  ],
});
