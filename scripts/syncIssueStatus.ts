import type { IssueNode, StatusProject, Trigger } from './IssueStatusTypes.ts';
import { gh } from './githubCli.ts';
import { planStatusSync } from './planStatusSync.ts';
import { loadProject, setBoardStatus } from './statusBoard.ts';
import { issueState, loadIssue, loadOpenIssues } from './statusIssues.ts';

function sync(issue: IssueNode, project: StatusProject, trigger: Trigger): void {
  if (issue.state !== 'OPEN') return;
  const plan = planStatusSync(issueState(issue, project), trigger);
  if (plan === undefined) return;
  const number = String(issue.number);
  const labelArgs = [
    ...(plan.addLabel === undefined ? [] : ['--add-label', plan.addLabel]),
    ...plan.removeLabels.flatMap((label) => ['--remove-label', label]),
  ];
  if (labelArgs.length > 0) gh(['issue', 'edit', number, ...labelArgs]);
  if (plan.boardStatus !== undefined) setBoardStatus(issue, project, plan.boardStatus);
  if (plan.close) gh(['issue', 'close', number, '--reason', 'completed']);
  process.stdout.write(`#${number}: ${JSON.stringify(plan)}\n`);
}

if ((process.env['PROJECT_TOKEN'] ?? '') === '') {
  throw new Error(
    'PROJECT_TOKEN is empty: add a token that can write to the project as a secret of the repository.',
  );
}
const project = loadProject();
const action = process.env['ACTION'] ?? '';
const number = Number(process.env['NUMBER'] ?? '');
if (process.env['EVENT_NAME'] === 'issues') {
  const trigger: Trigger =
    action === 'labeled'
      ? { kind: 'labeled', label: process.env['ADDED'] ?? '' }
      : { kind: 'opened' };
  sync(loadIssue(number), project, trigger);
} else {
  for (const issue of loadOpenIssues()) sync(issue, project, { kind: 'sweep' });
}
