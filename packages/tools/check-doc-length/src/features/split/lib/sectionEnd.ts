import type { Section } from '#src/features/split/SplitTypes.ts';

export function sectionEnd(sections: Section[], section: Section, limit: number): number {
  return (
    sections.find(
      (other) => other.start > section.start && other.depth <= section.depth && other.start < limit,
    )?.start ?? limit
  );
}
