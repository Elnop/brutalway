export type Manifest = { scripts: Record<string, string> };

export type StepResult = { script: string; passed: boolean; seconds: number; output: string };

export type StepsReport = { failed: string[]; skipped: string[] };
