export type Answers = Record<string, boolean>;

export type StackOption = {
  id: string;
  message: string;
  default: boolean;
  requires?: Answers;
  independent?: boolean;
};

export type FileEdit = { file: string; replace: string; with: string } | { file: string; dropLines: string } | { file: string; dropSection: string };

export type StackChange = {
  when: Answers;
  remove?: string[];
  edits?: FileEdit[];
  scripts?: string[];
  dependencies?: string[];
  devDependencies?: Record<string, string>;
  overlay?: string;
  keep?: string[];
};

export type Stack = {
  id: string;
  label: string;
  repository: string;
  submodule: string;
  options: StackOption[];
  changes: StackChange[];
  nextSteps: (answers: Answers) => string[];
};

export type TemplateSource = { kind: 'local'; root: string } | { kind: 'github'; ref: string };

export type ScaffoldPlan = {
  dir: string;
  projectName: string;
  stack: Stack;
  answers: Answers;
  source: TemplateSource;
  git: boolean;
  install: boolean;
};

export type PackageJson = Record<string, unknown> & {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
