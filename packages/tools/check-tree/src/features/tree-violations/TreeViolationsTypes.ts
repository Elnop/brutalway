export type TreeOptions = {
  rootEntries?: boolean;
};

export type FileGroup = {
  folder: string;
  belongs: (fileName: string) => boolean;
  appliesIn: (folderName: string) => boolean;
};

export type FolderListing = { files: string[]; folders: ReadonlySet<string> };
