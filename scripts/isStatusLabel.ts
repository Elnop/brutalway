import { STATUS_LABELS } from './IssueStatusConfig.ts';
import type { StatusLabel } from './IssueStatusTypes.ts';

export function isStatusLabel(label: string): label is StatusLabel {
  return STATUS_LABELS.some((status) => status === label);
}
