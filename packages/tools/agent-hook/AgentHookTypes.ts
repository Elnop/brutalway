export type HookCheck = {
  label: string;
  command: string;
  args: string[];
  cwd: string;
};

export type HookEdit = {
  file: string;
  created: boolean;
  before: boolean;
};
