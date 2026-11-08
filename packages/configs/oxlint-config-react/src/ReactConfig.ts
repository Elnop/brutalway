import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';
import { componentPropsOverrides } from '#src/features/component-props/ComponentPropsConfig.ts';
import { componentRolesOverrides } from '#src/features/component-roles/ComponentRolesConfig.ts';
import { fetchPlacementOverrides } from '#src/features/fetch-placement/FetchPlacementConfig.ts';
import { hookFilesOverrides } from '#src/features/hook-files/HookFilesConfig.ts';
import { hookNamingOverrides } from '#src/features/hook-naming/HookNamingConfig.ts';
import { storageOverrides, storageRules } from '#src/features/storage/StorageConfig.ts';

export const reactConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn'],
  jsPlugins: [
    { name: 'component-props', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    { name: 'hook-naming', specifier: fileURLToPath(new URL('./hookNamingPlugin.js', import.meta.url)) },
    { name: 'fetch-placement', specifier: fileURLToPath(new URL('./fetchPlugin.js', import.meta.url)) },
    { name: 'component-roles', specifier: fileURLToPath(new URL('./componentRolesPlugin.js', import.meta.url)) },
    { name: 'hook-files', specifier: fileURLToPath(new URL('./hookFilesPlugin.js', import.meta.url)) },
  ],
  env: { browser: true, es2024: true },
  rules: {
    'react/rules-of-hooks': 'error',
    'react/hooks': 'off',
    'react/immutability': 'off',
    'react/exhaustive-deps': 'error',
    'react/only-export-components': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/no-array-index-key': 'error',
    ...storageRules,
  },
  overrides: [
    ...componentPropsOverrides,
    ...hookNamingOverrides,
    ...fetchPlacementOverrides,
    ...storageOverrides,
    ...componentRolesOverrides,
    ...hookFilesOverrides,
    { files: ['**/*.test.tsx', 'e2e/**'], rules: { 'component-props/no-restricted-syntax': 'off', 'component-roles/no-restricted-syntax': 'off' } },
  ],
});
