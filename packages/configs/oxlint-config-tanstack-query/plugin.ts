import { definePlugin } from '@oxlint/plugins';
import { namedCacheWindows } from './namedCacheWindows.ts';
import { queryKeyFactory } from './queryKeyFactory.ts';

export default definePlugin({
  meta: { name: 'query-conventions' },
  rules: { 'query-key-factory': queryKeyFactory, 'named-cache-windows': namedCacheWindows },
});
