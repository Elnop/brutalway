import { DONE_OPTION, STATUS_OPTIONS } from './IssueStatusConfig.ts';
import type { IssueStatusState, StatusLabel, StatusPlan, Trigger } from './IssueStatusTypes.ts';

const STATUS_LABELS = Object.keys(STATUS_OPTIONS).filter((label): label is StatusLabel => label in STATUS_OPTIONS);

function isStatusLabel(label: string): label is StatusLabel {
  return STATUS_LABELS.some((status) => status === label);
}

function labelOfOption(option: string | undefined): StatusLabel | undefined {
  return STATUS_LABELS.find((label) => STATUS_OPTIONS[label] === option);
}

type Target = { label: StatusLabel; close: false } | { label: undefined; close: true };

function plan(state: IssueStatusState, target: Target): StatusPlan {
  const present = state.labels.filter(isStatusLabel);
  const option = target.close ? DONE_OPTION : STATUS_OPTIONS[target.label];
  return {
    addLabel: target.label === undefined || present.includes(target.label) ? undefined : target.label,
    removeLabels: target.close ? [] : present.filter((label) => label !== target.label),
    boardStatus: state.boardStatus === option ? undefined : option,
    close: target.close,
  };
}

function boardIsNewer(state: IssueStatusState): boolean {
  if (state.boardChangedAt === undefined) return false;
  return state.labelChangedAt === undefined || state.boardChangedAt > state.labelChangedAt;
}

function boardTarget(state: IssueStatusState): Target | undefined {
  if (state.boardStatus === DONE_OPTION) return { label: undefined, close: true };
  const label = labelOfOption(state.boardStatus);
  return label === undefined ? undefined : { label, close: false };
}

function chooseTarget(state: IssueStatusState, trigger: Trigger): Target {
  const fromLabel = trigger.kind === 'labeled' && isStatusLabel(trigger.label) ? trigger.label : STATUS_LABELS.find((label) => state.labels.includes(label));
  const fromAuthor: Target = { label: state.external ? 'triage' : 'todo', close: false };
  const labelTarget: Target | undefined = fromLabel === undefined ? undefined : { label: fromLabel, close: false };
  const board = trigger.kind === 'sweep' ? boardTarget(state) : undefined;
  return board !== undefined && (labelTarget === undefined || boardIsNewer(state)) ? board : (labelTarget ?? fromAuthor);
}

function changesSomething(result: StatusPlan): boolean {
  return result.addLabel !== undefined || result.removeLabels.length > 0 || result.boardStatus !== undefined || result.close;
}

export function planStatusSync(state: IssueStatusState, trigger: Trigger): StatusPlan | undefined {
  if (trigger.kind === 'labeled' && (!isStatusLabel(trigger.label) || !state.labels.includes(trigger.label))) return undefined;
  const result = plan(state, chooseTarget(state, trigger));
  return changesSomething(result) ? result : undefined;
}
