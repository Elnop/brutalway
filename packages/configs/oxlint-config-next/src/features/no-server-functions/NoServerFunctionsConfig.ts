import type { DummyRuleMap } from 'oxlint';

const SERVER_FUNCTIONS = [
  {
    selector: 'ExpressionStatement[directive="use server"]',
    message:
      'This project reads and writes its data through an API: no server action. Add a route handler (route.ts) and call it with TanStack Query.',
  },
  {
    selector: 'ExpressionStatement[directive=/^use cache/]',
    message:
      "This project caches its data with TanStack Query: no 'use cache'. Cache in the route handler or set the staleTime of the query.",
  },
];

export const noServerFunctionsRules: DummyRuleMap = {
  'server-actions/no-restricted-syntax': ['error', ...SERVER_FUNCTIONS],
};
