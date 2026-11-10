import { STATUS_OPTIONS, STATUS_PROJECT } from './IssueStatusConfig.ts';
import type { IssueNode, IssueStatusState, StatusProject } from './IssueStatusTypes.ts';
import { graphql } from './githubCli.ts';

const STATUS_FIELD = STATUS_PROJECT.field;
const MAINTAINERS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

const repository = process.env['GH_REPO'] ?? '';

const ISSUE_FIELDS = `id number state authorAssociation
  labels(first: 50) { nodes { name } }
  timelineItems(itemTypes: [LABELED_EVENT, UNLABELED_EVENT], last: 50) { nodes { ... on LabeledEvent { createdAt label { name } } ... on UnlabeledEvent { createdAt label { name } } } }
  projectItems(first: 20) { nodes { id project { id } fieldValueByName(name: "${STATUS_FIELD}") { ... on ProjectV2ItemFieldSingleSelectValue { name updatedAt } } } }`;

export function loadIssue(number: number): IssueNode {
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

export function loadOpenIssues(after?: string): IssueNode[] {
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

export function issueState(issue: IssueNode, project: StatusProject): IssueStatusState {
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
