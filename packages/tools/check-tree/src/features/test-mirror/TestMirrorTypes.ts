export type TreeEntries = { files: string[]; folders: string[] };

export type MirrorScan = {
  source: string;
  unit: string;
  sources: TreeEntries;
  platforms: readonly string[] | undefined;
};
