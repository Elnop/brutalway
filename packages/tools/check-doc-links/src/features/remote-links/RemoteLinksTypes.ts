import type { LinkResult } from '#src/shared-features/links/LinksTypes.ts';

export type RemoteCheck = {
  results: Map<string, LinkResult>;
  unchecked: number;
};
