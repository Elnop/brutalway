import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const SCROLL_TOLERANCE = 8;

export function useHideOnScrollDown(headerRef: RefObject<HTMLElement | null>): boolean {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const isHidden = isScrolledDown && !hasFocus;

  useEffect(() => {
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
  }, [headerRef]);

  useEffect(() => {
    const header = headerRef.current;
    if (header === null) return undefined;
    function onFocusIn(): void {
      setHasFocus(true);
    }
    function onFocusOut(event: FocusEvent): void {
      setHasFocus(event.relatedTarget instanceof Node && (header?.contains(event.relatedTarget) ?? false));
    }
    header.addEventListener('focusin', onFocusIn);
    header.addEventListener('focusout', onFocusOut);
    return () => {
      header.removeEventListener('focusin', onFocusIn);
      header.removeEventListener('focusout', onFocusOut);
    };
  }, [headerRef]);

  useEffect(() => {
    const header = headerRef.current;
    if (header === null) return;
    const root = document.documentElement;
    function publishOffset(element: HTMLElement): void {
      root.style.setProperty('--header-offset', isHidden ? '0px' : `${element.offsetHeight}px`);
    }
    publishOffset(header);
    const observer = new ResizeObserver(() => publishOffset(header));
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--header-offset');
    };
  }, [headerRef, isHidden]);

  return isHidden;
}
