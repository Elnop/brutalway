import { useEffect, useState } from 'react';

const SECTION_TOP_OFFSET = 120;
const NAV_MARGIN = 16;

function isScrolledToBottom(): boolean {
  return window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
}

function sectionAtTop(slugs: string[]): string | undefined {
  if (isScrolledToBottom()) return slugs.at(-1);
  let current: string | undefined;
  for (const slug of slugs) {
    const top = document.getElementById(slug)?.getBoundingClientRect().top;
    if (top === undefined || top > SECTION_TOP_OFFSET) break;
    current = slug;
  }
  return current;
}

function revealCurrentNavItem(): void {
  const nav = document.querySelector('.docs-nav');
  const item = nav?.querySelector('[aria-current="location"]');
  if (nav === null || nav === undefined || item === null || item === undefined) return;
  const navBox = nav.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  if (itemBox.top < navBox.top) nav.scrollBy({ top: itemBox.top - navBox.top - NAV_MARGIN });
  else if (itemBox.bottom > navBox.bottom) nav.scrollBy({ top: itemBox.bottom - navBox.bottom + NAV_MARGIN });
}

export function useVisibleSection(slugs: string[], ready: boolean): string | undefined {
  const [visible, setVisible] = useState<string>();
  useEffect(() => {
    if (!ready) return undefined;
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVisible(sectionAtTop(slugs)));
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [slugs, ready]);
  useEffect(() => {
    if (visible !== undefined) revealCurrentNavItem();
  }, [visible]);
  return visible;
}
