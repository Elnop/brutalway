import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesKeys } from './notesKeys.ts';
import { QUERY_CACHE } from './QueryConfig.ts';

export const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

export function useNotes(tag: string) {
  return useQuery({ queryKey: notesKeys.list(tag), queryFn: async () => [tag], ...QUERY_CACHE.standard });
}

export function useNote(id: number) {
  return useQuery({ queryKey: ['note'], queryFn: async () => id, gcTime: Infinity });
}

export function useForgetNotes() {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: notesKeys.all });
    client.setQueryData(['note', 1], 'cached');
  };
}

export function NotesProvider() {
  const client = new QueryClient();
  return client.isFetching();
}
