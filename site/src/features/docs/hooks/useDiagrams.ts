import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_CACHE } from '@/features/docs/configs/QueryConfig.ts';
import { docsKeys } from '@/features/docs/docsKeys.ts';
import { mermaidSources } from '@/features/docs/lib/mermaidSources.ts';
import { renderDiagram } from '@/features/docs/lib/renderDiagram.ts';

export function useDiagrams(markdown: string | undefined): Map<string, string> {
  const sources = useMemo(
    () => (markdown === undefined ? [] : mermaidSources(markdown)),
    [markdown],
  );
  return useQueries({
    queries: sources.map((source) => ({
      queryKey: docsKeys.diagram(source),
      queryFn: async () => renderDiagram(source),
      ...QUERY_CACHE.session,
    })),
    combine: (results) =>
      new Map(
        results.flatMap((result, index) => {
          const source = sources[index];
          return source === undefined || result.data === undefined ? [] : [[source, result.data]];
        }),
      ),
  });
}
