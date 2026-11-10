import { DONE_OPTION, STATUS_OPTIONS } from './IssueStatusConfig.ts';
import type { IssueStatusState, StatusPlan, StatusTarget, Trigger } from './IssueStatusTypes.ts';
import { chooseTarget } from './chooseTarget.ts';
import { isStatusLabel } from './isStatusLabel.ts';

function plan(state: IssueStatusState, target: StatusTarget): StatusPlan {
  const present = state.labels.filter(isStatusLabel);
  const option = target.close ? DONE_OPTION : STATUS_OPTIONS[target.label];
  return {
    addLabel:
      target.label === undefined || present.includes(target.label) ? undefined : target.label,
    removeLabels: target.close ? [] : present.filter((label) => label !== target.label),
    boardStatus: state.boardStatus === option ? undefined : option,
    close: target.close,
  };
}

function changesSomething(result: StatusPlan): boolean {
  return (
    result.addLabel !== undefined ||
    result.removeLabels.length > 0 ||
    result.boardStatus !== undefined ||
    result.close
  );
}

export function planStatusSync(state: IssueStatusState, trigger: Trigger): StatusPlan | undefined {
  if (
    trigger.kind === 'labeled' &&
    (!isStatusLabel(trigger.label) || !state.labels.includes(trigger.label))
  ) {
    return undefined;
  }
  const result = plan(state, chooseTarget(state, trigger));
  return changesSomething(result) ? result : undefined;
}
