import { definePlugin } from '@oxlint/plugins';
import { storeLayout } from '#src/features/store-layout/storeLayout.ts';

export default definePlugin({
  meta: { name: 'store-layout' },
  rules: { 'store-layout': storeLayout },
});
