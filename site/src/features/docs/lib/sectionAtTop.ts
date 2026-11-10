const SECTION_LINE_RATIO = 0.3;

function isScrolledToBottom(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
}

export function sectionAtTop(slugs: string[]): string | undefined {
  if (window.scrollY === 0) return undefined;
  if (isScrolledToBottom()) return slugs.at(-1);
  const line = window.innerHeight * SECTION_LINE_RATIO;
  let current: string | undefined;
  for (const slug of slugs) {
    const top = document.getElementById(slug)?.getBoundingClientRect().top;
    if (top === undefined || top > line) break;
    current = slug;
  }
  return current;
}
