export type Step =
  | { name: string; script: string }
  | { name: string; command: string; args: string[]; dependency: string };

export type Manifest = { scripts: Record<string, string>; dependencies: Set<string> };

export type StepsReport = { failed: string[]; skipped: string[] };
