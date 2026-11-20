export type TreeOptions = {
  rootEntries?: boolean;
  platforms?: readonly string[] | undefined;
};

export type TreeScan = {
  categories: ReadonlySet<string>;
  platforms: readonly string[] | undefined;
};

export type FileGroup = {
  folder: string;
  belongs: (fileName: string) => boolean;
  appliesIn: (folderName: string) => boolean;
};

export type FolderListing = {
  files: string[];
  folders: ReadonlySet<string>;
  baseOf: (fileName: string) => string;
};
