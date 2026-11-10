export type HookCheck = {
  label: string;
  command: string;
  args: string[];
  cwd: string;
};

export type HookScope = { trees: string[]; vendored?: string[]; rootEntries?: boolean };
