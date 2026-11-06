import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const SCROLL_TOLERANCE = 8;

export function useHideOnScrollDown(headerRef: RefObject<HTMLElement | null>): boolean {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    function onScroll(): void {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) < SCROLL_TOLERANCE) return;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      setIsHidden(scrollY > lastScrollY && scrollY > headerHeight);
      lastScrollY = scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
