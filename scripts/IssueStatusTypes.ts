import type { STATUS_OPTIONS } from './IssueStatusConfig.ts';

export type StatusLabel = keyof typeof STATUS_OPTIONS;

export type Trigger = { kind: 'sweep' } | { kind: 'opened' } | { kind: 'labeled'; label: string };

export type IssueStatusState = {
  labels: string[];
  labelChangedAt: string | undefined;
  boardStatus: string | undefined;
  boardChangedAt: string | undefined;
  external: boolean;
};

export type StatusPlan = {
  addLabel: StatusLabel | undefined;
  removeLabels: StatusLabel[];
  boardStatus: string | undefined;
  close: boolean;
};
