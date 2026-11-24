import type { WorkspaceSettings } from '#src/features/scaffolding/ScaffoldTypes.ts';

function yamlKey(key: string): string {
  return /^[\w-][\w.>-]*$/u.test(key) ? key : `'${key}'`;
}

function block(name: string, entries: [string, string][]): string[] {
  if (entries.length === 0) return [];
  return [`${name}:`, ...entries.map(([key, value]) => `  ${yamlKey(key)}: ${value}`)];
}

export function pnpmWorkspace({ allowBuilds, overrides, nodeLinker }: WorkspaceSettings): string {
  return `${[
    ...block(
      'allowBuilds',
      Object.entries(allowBuilds).map(([key, value]) => [key, String(value)]),
    ),
    ...block('overrides', Object.entries(overrides)),
    'engineStrict: true',
    ...(nodeLinker === undefined ? [] : [`nodeLinker: ${nodeLinker}`]),
    'saveExact: true',
  ].join('\n')}\n`;
}
