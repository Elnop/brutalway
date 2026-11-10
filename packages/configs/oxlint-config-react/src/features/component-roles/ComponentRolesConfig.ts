import type { OxlintOverride } from 'oxlint';

const MAX_COMPONENT_PROPS = 6;

const ORCHESTRATOR = 'FunctionDeclaration[id.name=/^[A-Z]\\w*(Container|Layout|Page)$/]';

const PRESENTER_FORMATTING = [
  {
    selector:
      'CallExpression > MemberExpression.callee[property.name=/^(toLocaleString|toLocaleDateString|toLocaleTimeString|toFixed)$/]',
    message:
      'A presenter renders what it gets: format dates and numbers in the orchestrator or in a hook, and pass the string as a prop.',
  },
  {
    selector: 'MemberExpression[object.name="Intl"]',
    message:
      'A presenter renders what it gets: format dates and numbers in the orchestrator or in a hook, and pass the string as a prop.',
  },
  {
    selector:
      'CallExpression > MemberExpression.callee[property.name=/^(sort|toSorted|filter|reduce)$/]',
    message:
      'A presenter renders what it gets: sort, filter or reduce the list in the orchestrator or in a hook (a selector), and pass the result as a prop. map stays fine for rendering.',
  },
];

const COMPONENT_ROLES = [
  {
    selector: `TSTypeAliasDeclaration[id.name=/Props$/] > TSTypeLiteral > TSPropertySignature:nth-child(${MAX_COMPONENT_PROPS + 1})`,
    message: `A component takes at most ${MAX_COMPONENT_PROPS} props: group the related ones into an object, or split the component.`,
  },
];

const ORCHESTRATOR_ROLE = [
  ...COMPONENT_ROLES,
  {
    selector: `${ORCHESTRATOR}:not(:has(CallExpression[callee.name=/^use[A-Z]/]))`,
    message:
      'An XContainer, XLayout or XPage reads state through a hook and hands it to presenters: call the hook here, or rename the component, since it is a presenter.',
  },
];

export const componentRolesOverrides: OxlintOverride[] = [
  {
    files: ['**/*.tsx'],
    rules: {
      'component-roles/no-restricted-syntax': [
        'error',
        ...COMPONENT_ROLES,
        ...PRESENTER_FORMATTING,
      ],
    },
  },
  {
    files: ['**/*Container.tsx', '**/*Layout.tsx', '**/*Page.tsx'],
    rules: { 'component-roles/no-restricted-syntax': ['error', ...ORCHESTRATOR_ROLE] },
  },
];
