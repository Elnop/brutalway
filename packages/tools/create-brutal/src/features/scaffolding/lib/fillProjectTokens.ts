import { PROJECT_ID_TOKEN, PROJECT_NAME_TOKEN } from '#src/features/scaffolding/ScaffoldConfig.ts';

export function fillProjectTokens(text: string, projectName: string): string {
  const projectId = projectName.replaceAll(/[^a-z0-9]/gu, '').replace(/^(?=\d|$)/u, 'app');
  return text.replaceAll(PROJECT_NAME_TOKEN, projectName).replaceAll(PROJECT_ID_TOKEN, projectId);
}
