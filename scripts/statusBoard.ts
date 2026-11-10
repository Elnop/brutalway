import { STATUS_PROJECT } from './IssueStatusConfig.ts';
import type { IssueNode, StatusProject } from './IssueStatusTypes.ts';
import { graphql } from './githubCli.ts';

const STATUS_FIELD = STATUS_PROJECT.field;

export function loadProject(): StatusProject {
  const answer: {
    data: {
      user: {
        projectV2: { id: string; field: { id: string; options: { id: string; name: string }[] } };
      };
    };
  } = JSON.parse(
    graphql(
      `query($owner: String!, $number: Int!) { user(login: $owner) { projectV2(number: $number) { id field(name: "${STATUS_FIELD}") { ... on ProjectV2SingleSelectField { id options { id name } } } } } }`,
      { owner: STATUS_PROJECT.owner, number: STATUS_PROJECT.number },
    ),
  );
  const { id, field } = answer.data.user.projectV2;
  return {
    id,
    fieldId: field.id,
    options: new Map(field.options.map((option) => [option.name, option.id])),
  };
}

function projectItemId(issue: IssueNode, project: StatusProject): string {
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

const SET_STATUS_MUTATION = `
      mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $project
            itemId: $item
            fieldId: $field
            value: { singleSelectOptionId: $option }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `;

export function setBoardStatus(
  issue: IssueNode,
  project: StatusProject,
  boardStatus: string,
): void {
  const option = project.options.get(boardStatus);
  if (option === undefined) {
    throw new Error(`The ${STATUS_FIELD} field of the project has no option named ${boardStatus}.`);
  }
  graphql(SET_STATUS_MUTATION, {
    project: project.id,
    item: projectItemId(issue, project),
    field: project.fieldId,
    option,
  });
}
