import type { TailwindClass } from '#src/shared-features/tailwind-classes/TailwindClassesTypes.ts';

export function tailwindClass(name: string): TailwindClass {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const character of name) {
    if (character === '[' || character === '(') depth += 1;
    if (character === ']' || character === ')') depth -= 1;
    if (character === ':' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  return { variants: parts, utility: current.replaceAll(/^!|!$/gu, '') };
}
