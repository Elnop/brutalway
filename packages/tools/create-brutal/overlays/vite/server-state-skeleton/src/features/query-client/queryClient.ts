import { QueryClient } from '@tanstack/react-query';
import { QUERY_CACHE } from '@/features/query-client/QueryConfig.ts';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { ...QUERY_CACHE.standard, throwOnError: true },
    mutations: { throwOnError: true },
  },
});
