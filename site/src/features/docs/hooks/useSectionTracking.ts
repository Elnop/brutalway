import { useEffect, useRef, useState } from 'react';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';
import { revealCurrentNavItem } from '@/features/docs/lib/revealCurrentNavItem.ts';
import { sectionAtTop } from '@/features/docs/lib/sectionAtTop.ts';

type WrittenSection = { section: string | undefined } | undefined;

function scrollToSection(section: string | undefined): void {
  if (section === undefined) window.scrollTo(0, 0);
  else document.getElementById(section)?.scrollIntoView();
}

function trackVisibleSection(
  slugs: string[],
  setVisible: (section: string | undefined) => void,
): () => void {
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

function writeSectionHash(
  source: DocsRoute['source'],
  path: string,
  visible: string | undefined,
): void {
  const hash =
    visible === undefined ? docHref(source, path) : `${docHref(source, path)}#${visible}`;
  if (window.location.hash !== hash) window.history.replaceState(window.history.state, '', hash);
  if (visible !== undefined) revealCurrentNavItem();
}

export function useSectionTracking(
  route: DocsRoute,
  slugs: string[],
  ready: boolean,
): string | undefined | null {
  const [visible, setVisible] = useState<string | undefined | null>(null);
  const written = useRef<WrittenSection>(undefined);
  const { section } = route;

  useEffect(() => {
    if (written.current !== undefined && written.current.section === section) return;
    if (section === undefined || ready) scrollToSection(section);
  }, [section, ready]);

  useEffect(() => (ready ? trackVisibleSection(slugs, setVisible) : undefined), [slugs, ready]);

  useEffect(() => {
    if (!ready || visible === null) return;
    written.current = { section: visible };
    writeSectionHash(route.source, route.path, visible);
  }, [visible, ready, route.source, route.path]);

  return visible;
}
