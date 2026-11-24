export type AnswerValue = boolean | string;

export type Answers = Record<string, AnswerValue>;

export type ChangeCondition = Record<string, AnswerValue | AnswerValue[]>;

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
  when: ChangeCondition;
  move?: Record<string, string>;
  remove?: string[];
  discard?: string[];
  edits?: FileEdit[];
  removeScripts?: string[];
  removePackageFields?: string[];
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
  projectVersion?: string;
  options: StackOption[];
  changes: StackChange[];
  nextSteps: (answers: Answers) => string[];
};
export type BrutalwayState = {
  schemaVersion: number;
  createBrutal: string;
  stack: string;
  projectName: string;
  options: Answers;
};
