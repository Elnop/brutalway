import { definePlugin } from '@oxlint/plugins';
import { namedCacheWindows } from '#src/features/named-cache-windows/namedCacheWindows.ts';
import { queryKeyFactory } from '#src/features/query-key-factory/queryKeyFactory.ts';

export default definePlugin({
  meta: { name: 'query-conventions' },
  rules: { 'query-key-factory': queryKeyFactory, 'named-cache-windows': namedCacheWindows },
});
