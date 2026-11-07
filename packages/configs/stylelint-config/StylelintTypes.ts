export type Oklab = { l: number; a: number; b: number };

export type ColorToken = { name: string; color: Oklab | undefined };

export type ColorTokensOptions = { stylesheet?: string };

export type ComponentFile = { name: string; text: string };
