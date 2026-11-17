import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const PRINT_WIDTH = 100;

const LOOKS = [
  { when: { styling: 'css' }, configs: [] },
  { when: { styling: 'css-modules' }, configs: [] },
  { when: { styling: 'tailwind', ui: 'none' }, configs: ['tailwindConfig'] },
  { when: { styling: 'tailwind', ui: 'shadcn' }, configs: ['shadcnConfig', 'tailwindConfig'] },
];

function extendsChange(forms: boolean, look: (typeof LOOKS)[number]): StackChange[] {
  const configs = [
    'nextConfig',
    ...(forms ? ['reactHookFormConfig'] : []),
    'noServerFunctionsConfig',
    'tanstackQueryConfig',
    ...look.configs,
    'i18nextConfig',
  ];
  const line = `extends: [${configs.join(', ')}],`;
  if (`  ${line}`.length <= PRINT_WIDTH) return [];
  const wrapped = `extends: [\n${configs.map((config) => `    ${config},\n`).join('')}  ],`;
  return [
    {
      when: { 'server-state': true, forms, ...look.when },
      edits: [{ file: 'oxlint.config.ts', replace: line, with: wrapped }],
    },
  ];
}

export function nextServerStateExtends(): StackChange[] {
  return [true, false].flatMap((forms) => LOOKS.flatMap((look) => extendsChange(forms, look)));
}
