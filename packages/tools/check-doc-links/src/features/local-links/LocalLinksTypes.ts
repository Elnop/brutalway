export type ProjectContext = {
  gitRoot: string;
  repository: string | undefined;
  packages: Set<string>;
};
