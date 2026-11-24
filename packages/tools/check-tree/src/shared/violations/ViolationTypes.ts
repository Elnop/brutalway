export type KnownViolation = { rule: string; path: string; count?: number };

export type FileMove = { from: string; to: string };

export type Violation = KnownViolation & { message: string; move?: FileMove };
