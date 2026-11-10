import { DONE_OPTION, STATUS_LABELS, STATUS_OPTIONS } from './IssueStatusConfig.ts';
import type { IssueStatusState, StatusLabel, StatusTarget, Trigger } from './IssueStatusTypes.ts';
import { isStatusLabel } from './isStatusLabel.ts';

function labelOfOption(option: string | undefined): StatusLabel | undefined {
  return STATUS_LABELS.find((label) => STATUS_OPTIONS[label] === option);
}

function boardIsNewer(state: IssueStatusState): boolean {
  if (state.boardChangedAt === undefined) return false;
  return state.labelChangedAt === undefined || state.boardChangedAt > state.labelChangedAt;
}

function boardTarget(state: IssueStatusState): StatusTarget | undefined {
  if (state.boardStatus === DONE_OPTION) return { label: undefined, close: true };
  const label = labelOfOption(state.boardStatus);
  return label === undefined ? undefined : { label, close: false };
}

export function chooseTarget(state: IssueStatusState, trigger: Trigger): StatusTarget {
  const fromLabel = trigger.kind === 'labeled' && isStatusLabel(trigger.label) ? trigger.label : STATUS_LABELS.find((label) => state.labels.includes(label));
  const fromAuthor: StatusTarget = { label: state.external ? 'triage' : 'todo', close: false };
  const labelTarget: StatusTarget | undefined = fromLabel === undefined ? undefined : { label: fromLabel, close: false };
  const board = trigger.kind === 'sweep' ? boardTarget(state) : undefined;
  return board !== undefined && (labelTarget === undefined || boardIsNewer(state)) ? board : (labelTarget ?? fromAuthor);
}
