import { useEffect, useRef, useState } from 'react';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';

const SECTION_LINE_RATIO = 0.3;
const NAV_MARGIN = 16;

type WrittenSection = { section: string | undefined } | undefined;

function isScrolledToBottom(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
}

function sectionAtTop(slugs: string[]): string | undefined {
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

function revealCurrentNavItem(): void {
  const nav = document.querySelector('.docs-nav');
  const item = nav?.querySelector('[aria-current="location"]');
  if (nav === null || nav === undefined || item === null || item === undefined) return;
  const navBox = nav.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  if (itemBox.top < navBox.top) nav.scrollBy({ top: itemBox.top - navBox.top - NAV_MARGIN });
  else if (itemBox.bottom > navBox.bottom) nav.scrollBy({ top: itemBox.bottom - navBox.bottom + NAV_MARGIN });
}

function scrollToSection(section: string | undefined): void {
  if (section === undefined) window.scrollTo(0, 0);
  else document.getElementById(section)?.scrollIntoView();
}

function trackVisibleSection(slugs: string[], setVisible: (section: string | undefined) => void): () => void {
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
}

export function useSectionTracking(route: DocsRoute, slugs: string[], ready: boolean): string | undefined | null {
  const [visible, setVisible] = useState<string | undefined | null>(null);
  const written = useRef<WrittenSection>(undefined);
  const { source, path, section } = route;

  useEffect(() => {
    if (written.current !== undefined && written.current.section === section) return;
    if (section === undefined || ready) scrollToSection(section);
  }, [section, ready]);

  useEffect(() => (ready ? trackVisibleSection(slugs, setVisible) : undefined), [slugs, ready]);

  useEffect(() => {
    if (!ready || visible === null) return;
    const hash = visible === undefined ? docHref(source, path) : `${docHref(source, path)}#${visible}`;
    written.current = { section: visible };
    if (window.location.hash !== hash) window.history.replaceState(window.history.state, '', hash);
    if (visible !== undefined) revealCurrentNavItem();
  }, [visible, ready, source, path]);

  return visible;
}
