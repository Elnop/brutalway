import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useHeaderHeight(headerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const header = headerRef.current;
    if (header === null) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty('--header-height', `${header.offsetHeight}px`));
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--header-height');
    };
  }, [headerRef]);
}
