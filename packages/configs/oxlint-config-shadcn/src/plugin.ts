import { definePlugin } from '@oxlint/plugins';
import { oneIconLibrary } from '#src/features/one-icon-library/oneIconLibrary.ts';
import { primitivesFirst } from '#src/features/primitives-first/primitivesFirst.ts';

export default definePlugin({
  meta: { name: 'ui-conventions' },
  rules: { 'primitives-first': primitivesFirst, 'one-icon-library': oneIconLibrary },
});
