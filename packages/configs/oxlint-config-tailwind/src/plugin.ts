import { definePlugin } from '@oxlint/plugins';
import { colorTokens } from '#src/features/color-tokens/lib/colorTokens.ts';
import { fontRoles } from '#src/features/font-roles/fontRoles.ts';
import { noDarkVariant } from '#src/features/no-dark-variant/noDarkVariant.ts';

export default definePlugin({
  meta: { name: 'tailwind' },
  rules: { 'color-tokens': colorTokens, 'font-roles': fontRoles, 'no-dark-variant': noDarkVariant },
});
