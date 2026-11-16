import type { LinkResult } from '#src/shared/links/LinksTypes.ts';

export type RemoteCheck = {
  results: Map<string, LinkResult>;
  unchecked: number;
};
