import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const SCROLL_TOLERANCE = 8;

type HeaderRef = RefObject<HTMLElement | null>;

function watchScrollDirection(
  headerRef: HeaderRef,
  setIsScrolledDown: (isScrolledDown: boolean) => void,
): () => void {
  let lastScrollY = window.scrollY;
  function onScroll(): void {
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScrollY) < SCROLL_TOLERANCE) return;
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    setIsScrolledDown(scrollY > lastScrollY && scrollY > headerHeight);
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

function watchFocusWithin(
  header: HTMLElement,
  setHasFocus: (hasFocus: boolean) => void,
): () => void {
  function onFocusIn(): void {
    setHasFocus(true);
  }
  function onFocusOut(event: FocusEvent): void {
    setHasFocus(event.relatedTarget instanceof Node && header.contains(event.relatedTarget));
  }
  header.addEventListener('focusin', onFocusIn);
  header.addEventListener('focusout', onFocusOut);
  return () => {
    header.removeEventListener('focusin', onFocusIn);
    header.removeEventListener('focusout', onFocusOut);
  };
}

function publishHeaderOffset(header: HTMLElement, isHidden: boolean): () => void {
  const root = document.documentElement;
  function publishOffset(): void {
    root.style.setProperty('--header-offset', isHidden ? '0px' : `${header.offsetHeight}px`);
  }
  publishOffset();
  const observer = new ResizeObserver(publishOffset);
  observer.observe(header);
  return () => {
    observer.disconnect();
    root.style.removeProperty('--header-offset');
  };
}

export function useHideOnScrollDown(headerRef: HeaderRef): boolean {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const isHidden = isScrolledDown && !hasFocus;

  useEffect(() => watchScrollDirection(headerRef, setIsScrolledDown), [headerRef]);

  useEffect(() => {
    const header = headerRef.current;
    return header === null ? undefined : watchFocusWithin(header, setHasFocus);
  }, [headerRef]);

  useEffect(() => {
    const header = headerRef.current;
    return header === null ? undefined : publishHeaderOffset(header, isHidden);
  }, [headerRef, isHidden]);

  return isHidden;
}
