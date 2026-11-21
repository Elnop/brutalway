import type { Finding } from '#src/features/findings/FindingsTypes.ts';

export function reportedFindings(
  findings: readonly Finding[],
  files: ReadonlySet<string> | undefined,
): string[] {
  return findings
    .filter(({ File }) => files === undefined || files.has(File))
    .toSorted((a, b) => a.File.localeCompare(b.File) || a.StartLine - b.StartLine)
    .map(
      ({ File, StartLine, RuleID, Description, Fingerprint }) =>
        `${File}:${StartLine} ${RuleID}: ${Description.replace(/\.$/u, '')}. Remove it and revoke it, or, if it is public by design, add ${Fingerprint} to .gitleaksignore`,
    );
}
