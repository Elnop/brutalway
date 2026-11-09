import { useEffect } from 'react';

export function useScrollToSection(section: string | undefined, ready: boolean): void {
  useEffect(() => {
    if (section === undefined) {
      window.scrollTo(0, 0);
      return;
    }
    if (ready) document.getElementById(section)?.scrollIntoView();
  }, [section, ready]);
}
