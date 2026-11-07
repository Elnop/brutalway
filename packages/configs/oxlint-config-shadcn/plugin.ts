import { definePlugin } from '@oxlint/plugins';
import { oneIconLibrary } from './oneIconLibrary.ts';
import { primitivesFirst } from './primitivesFirst.ts';

export default definePlugin({
  meta: { name: 'ui-conventions' },
  rules: { 'primitives-first': primitivesFirst, 'one-icon-library': oneIconLibrary },
});
