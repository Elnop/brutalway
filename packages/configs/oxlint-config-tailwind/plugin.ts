import { definePlugin } from '@oxlint/plugins';
import { colorTokens } from './colorTokens.ts';
import { fontRoles } from './fontRoles.ts';
import { noDarkVariant } from './noDarkVariant.ts';

export default definePlugin({
  meta: { name: 'tailwind' },
  rules: { 'color-tokens': colorTokens, 'font-roles': fontRoles, 'no-dark-variant': noDarkVariant },
});
