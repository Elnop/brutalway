import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { QUERY_CACHE } from '@/features/query-client/QueryConfig.ts';

type QueryProviderProps = { children: ReactNode };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { ...QUERY_CACHE.standard, throwOnError: true },
    mutations: { throwOnError: true },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
