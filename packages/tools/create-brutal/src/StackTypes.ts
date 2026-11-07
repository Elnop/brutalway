export type AnswerValue = boolean | string;

export type Answers = Record<string, AnswerValue>;

export type Blocker = { id: string; value: AnswerValue };

export type OptionRules = {
  requires?: Answers;
  conflicts?: Answers;
};

type OptionValue = OptionRules & {
  id: string;
  label: string;
};

type ToggleOption = OptionRules & {
  id: string;
  message: string;
  default: boolean;
  independent?: boolean;
};

export type ChoiceOption = {
  id: string;
  message: string;
  values: OptionValue[];
  default: string;
  independent?: boolean;
};

export type StackOption = ToggleOption | ChoiceOption;

export type FileEdit =
  | { file: string; replace: string; with: string; all?: boolean }
  | { file: string; dropLines: string }
  | { file: string; dropSection: string }
  | { file: string; after: string; insert: string }
  | { file: string; before: string; insert: string };

export type StackChange = {
  when: Answers;
  remove?: string[];
  edits?: FileEdit[];
  removeScripts?: string[];
  removeDependencies?: string[];
  addDependencies?: Record<string, string>;
  addDevDependencies?: Record<string, string>;
  overlay?: string;
  keep?: string[];
};

export type Stack = {
  id: string;
  label: string;
  directory: string;
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
