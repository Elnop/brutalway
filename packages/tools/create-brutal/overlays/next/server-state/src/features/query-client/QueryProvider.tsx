'use client';

import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { QUERY_CACHE } from '@/features/query-client/QueryConfig.ts';

type QueryProviderProps = { children: ReactNode };

function newQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { ...QUERY_CACHE.standard, throwOnError: true },
      mutations: { throwOnError: true },
    },
  });
}

const browserQueryClient = environmentManager.isServer() ? undefined : newQueryClient();

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={browserQueryClient ?? newQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
