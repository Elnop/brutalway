export type Snapshot = {
  label: string;
  read: (path: string) => string | undefined;
  directives: () => string[];
};
