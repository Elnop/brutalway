import type { StackChange } from '#src/shared-features/stack/StackTypes.ts';

export function fillAnchors(
  changes: StackChange[],
  anchors: Record<string, string>,
): StackChange[] {
  let text = JSON.stringify(changes);
  for (const [name, value] of Object.entries(anchors)) {
    text = text.replaceAll(`{{${name}}}`, JSON.stringify(value).slice(1, -1));
  }
  const missing = /\{\{(\w+)\}\}/u.exec(text);
  if (missing !== null) throw new Error(`no value for the anchor ${missing[1] ?? ''}`);
  const filled: StackChange[] = JSON.parse(text);
  return filled;
}
