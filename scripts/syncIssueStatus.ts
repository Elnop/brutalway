import { execFileSync } from 'node:child_process';
import { STATUS_OPTIONS, STATUS_PROJECT } from './IssueStatusConfig.ts';
import type { IssueStatusState, Trigger } from './IssueStatusTypes.ts';
import { planStatusSync } from './planStatusSync.ts';

const STATUS_FIELD = STATUS_PROJECT.field;
const MAINTAINERS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

const repository = process.env['GH_REPO'] ?? '';
const projectToken = process.env['PROJECT_TOKEN'] ?? '';

function gh(args: string[], token?: string): string {
  return execFileSync('gh', args, { encoding: 'utf8', env: token === undefined ? process.env : { ...process.env, GH_TOKEN: token } }).trim();
}

function graphql(query: string, variables: Record<string, string | number>): string {
  const fields = Object.entries(variables).flatMap(([name, value]) => [typeof value === 'number' ? '-F' : '-f', `${name}=${String(value)}`]);
  return gh(['api', 'graphql', '-f', `query=${query}`, ...fields], projectToken);
}

type Project = { id: string; fieldId: string; options: Map<string, string> };

function loadProject(): Project {
  const answer: { data: { user: { projectV2: { id: string; field: { id: string; options: { id: string; name: string }[] } } } } } = JSON.parse(
    graphql(
      `query($owner: String!, $number: Int!) { user(login: $owner) { projectV2(number: $number) { id field(name: "${STATUS_FIELD}") { ... on ProjectV2SingleSelectField { id options { id name } } } } } }`,
      { owner: STATUS_PROJECT.owner, number: STATUS_PROJECT.number },
    ),
  );
  const { id, field } = answer.data.user.projectV2;
  return { id, fieldId: field.id, options: new Map(field.options.map((option) => [option.name, option.id])) };
}

const ISSUE_FIELDS = `id number state authorAssociation
  labels(first: 50) { nodes { name } }
  timelineItems(itemTypes: [LABELED_EVENT, UNLABELED_EVENT], last: 50) { nodes { ... on LabeledEvent { createdAt label { name } } ... on UnlabeledEvent { createdAt label { name } } } }
  projectItems(first: 20) { nodes { id project { id } fieldValueByName(name: "${STATUS_FIELD}") { ... on ProjectV2ItemFieldSingleSelectValue { name updatedAt } } } }`;

type IssueNode = {
  id: string;
  number: number;
  state: string;
  authorAssociation: string;
  labels: { nodes: { name: string }[] };
  timelineItems: { nodes: { createdAt?: string; label?: { name: string } | null }[] };
  projectItems: { nodes: { id: string; project: { id: string }; fieldValueByName: { name: string; updatedAt: string } | null }[] };
};

function loadIssue(number: number): IssueNode {
  const [owner, name] = repository.split('/');
  const answer: { data: { repository: { issue: IssueNode } } } = JSON.parse(
    graphql(`query($owner: String!, $name: String!, $number: Int!) { repository(owner: $owner, name: $name) { issue(number: $number) { ${ISSUE_FIELDS} } } }`, {
      owner: owner ?? '',
      name: name ?? '',
      number,
    }),
  );
  return answer.data.repository.issue;
}

function loadOpenIssues(after?: string): IssueNode[] {
  const [owner, name] = repository.split('/');
  const answer: { data: { repository: { issues: { nodes: IssueNode[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } } } = JSON.parse(
    graphql(
      `query($owner: String!, $name: String!, $after: String) { repository(owner: $owner, name: $name) { issues(states: OPEN, first: 50, after: $after) { nodes { ${ISSUE_FIELDS} } pageInfo { hasNextPage endCursor } } } }`,
      after === undefined ? { owner: owner ?? '', name: name ?? '' } : { owner: owner ?? '', name: name ?? '', after },
    ),
  );
  const page = answer.data.repository.issues;
  return page.pageInfo.hasNextPage ? [...page.nodes, ...loadOpenIssues(page.pageInfo.endCursor)] : page.nodes;
}

function issueState(issue: IssueNode, project: Project): IssueStatusState {
  const item = issue.projectItems.nodes.find((node) => node.project.id === project.id);
  const statusEvents = issue.timelineItems.nodes.filter((event) => event.createdAt !== undefined && (event.label?.name ?? '') in STATUS_OPTIONS);
  return {
    labels: issue.labels.nodes.map((label) => label.name),
    labelChangedAt: statusEvents.at(-1)?.createdAt,
    boardStatus: item?.fieldValueByName?.name,
    boardChangedAt: item?.fieldValueByName?.updatedAt,
    external: !MAINTAINERS.has(issue.authorAssociation),
  };
}

function projectItemId(issue: IssueNode, project: Project): string {
  const existing = issue.projectItems.nodes.find((node) => node.project.id === project.id);
  if (existing !== undefined) return existing.id;
  const answer: { data: { addProjectV2ItemById: { item: { id: string } } } } = JSON.parse(
    graphql(
      `
        mutation ($project: ID!, $content: ID!) {
          addProjectV2ItemById(input: { projectId: $project, contentId: $content }) {
            item {
              id
            }
          }
        }
      `,
      {
        project: project.id,
        content: issue.id,
      },
    ),
  );
  return answer.data.addProjectV2ItemById.item.id;
}

function setBoardStatus(issue: IssueNode, project: Project, boardStatus: string): void {
  const option = project.options.get(boardStatus);
  if (option === undefined) throw new Error(`The ${STATUS_FIELD} field of the project has no option named ${boardStatus}.`);
  graphql(
    `
      mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
        updateProjectV2ItemFieldValue(input: { projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option } }) {
          projectV2Item {
            id
          }
        }
      }
    `,
    { project: project.id, item: projectItemId(issue, project), field: project.fieldId, option },
  );
}

function sync(issue: IssueNode, project: Project, trigger: Trigger): void {
  if (issue.state !== 'OPEN') return;
  const plan = planStatusSync(issueState(issue, project), trigger);
  if (plan === undefined) return;
  const number = String(issue.number);
  const labelArgs = [...(plan.addLabel === undefined ? [] : ['--add-label', plan.addLabel]), ...plan.removeLabels.flatMap((label) => ['--remove-label', label])];
  if (labelArgs.length > 0) gh(['issue', 'edit', number, ...labelArgs]);
  if (plan.boardStatus !== undefined) setBoardStatus(issue, project, plan.boardStatus);
  if (plan.close) gh(['issue', 'close', number, '--reason', 'completed']);
  process.stdout.write(`#${number}: ${JSON.stringify(plan)}\n`);
}

if (projectToken === '') throw new Error('PROJECT_TOKEN is empty: add a token that can write to the project as a secret of the repository.');
const project = loadProject();
const action = process.env['ACTION'] ?? '';
const number = Number(process.env['NUMBER'] ?? '');
if (process.env['EVENT_NAME'] === 'issues') {
  const trigger: Trigger = action === 'labeled' ? { kind: 'labeled', label: process.env['ADDED'] ?? '' } : { kind: 'opened' };
  sync(loadIssue(number), project, trigger);
} else {
  for (const issue of loadOpenIssues()) sync(issue, project, { kind: 'sweep' });
}
