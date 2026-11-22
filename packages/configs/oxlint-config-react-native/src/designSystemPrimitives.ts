import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

type DesignSystemOptions = { components: string[]; files: string[] };

export function designSystemPrimitives({ components, files }: DesignSystemOptions): OxlintConfig {
  return defineConfig({
    jsPlugins: [
      {
        name: 'design-system',
        specifier: fileURLToPath(new URL('./designSystemPlugin.js', import.meta.url)),
      },
    ],
    rules: {
      'design-system/no-restricted-syntax': [
        'error',
        {
          selector: `ImportDeclaration[source.value='react-native'][importKind!='type'] > ImportSpecifier[importKind!='type'][imported.name=/^(${components.join('|')})$/u]`,
          message:
            'This component comes from the design system: import its wrapper instead of the react-native one, so the font, the colors and the focus stay the same everywhere.',
        },
      ],
    },
    overrides: [{ files, rules: { 'design-system/no-restricted-syntax': 'off' } }],
  });
}
