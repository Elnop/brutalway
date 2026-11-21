export type KnownViolation = { rule: string; path: string; count?: number };

export type Violation = KnownViolation & { message: string };
