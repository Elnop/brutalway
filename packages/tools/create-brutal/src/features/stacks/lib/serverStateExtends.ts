import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const PRINT_WIDTH = 100;

const LOOKS = [
  { when: { styling: 'css' }, configs: [] },
  { when: { styling: 'css-modules' }, configs: [] },
  { when: { styling: 'tailwind', ui: 'none' }, configs: ['tailwindConfig'] },
  { when: { styling: 'tailwind', ui: 'shadcn' }, configs: ['shadcnConfig', 'tailwindConfig'] },
];

const LANGUAGES = [
  { when: { i18n: ['en', 'en-fr'] }, configs: ['i18nextConfig'] },
  { when: { i18n: 'none' }, configs: [] },
];

type Variant = { when: StackChange['when']; configs: string[] };

type Head = { preset: string; serverState: string[] };

function extendsChange(
  head: Head,
  forms: boolean,
  look: Variant,
  languages: Variant,
): StackChange[] {
  const configs = [
    head.preset,
    ...(forms ? ['reactHookFormConfig'] : []),
    ...head.serverState,
    ...look.configs,
    ...languages.configs,
  ];
  const line = `extends: [${configs.join(', ')}],`;
  if (`  ${line}`.length <= PRINT_WIDTH) return [];
  const wrapped = `extends: [\n${configs.map((config) => `    ${config},\n`).join('')}  ],`;
  return [
    {
      when: { 'server-state': true, forms, ...look.when, ...languages.when },
      edits: [{ file: 'oxlint.config.ts', replace: line, with: wrapped }],
    },
  ];
}

export function serverStateExtends(head: Head): StackChange[] {
  return [true, false].flatMap((forms) =>
    LOOKS.flatMap((look) =>
      LANGUAGES.flatMap((languages) => extendsChange(head, forms, look, languages)),
    ),
  );
}
