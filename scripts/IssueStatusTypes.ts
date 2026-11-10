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

export type StatusTarget = { label: StatusLabel; close: false } | { label: undefined; close: true };

export type StatusProject = { id: string; fieldId: string; options: Map<string, string> };

export type IssueNode = {
  id: string;
  number: number;
  state: string;
  authorAssociation: string;
  labels: { nodes: { name: string }[] };
  timelineItems: { nodes: { createdAt?: string; label?: { name: string } | null }[] };
  projectItems: {
    nodes: {
      id: string;
      project: { id: string };
      fieldValueByName: { name: string; updatedAt: string } | null;
    }[];
  };
};
