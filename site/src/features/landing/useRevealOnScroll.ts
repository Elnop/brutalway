import { useEffect } from 'react';

const VISIBLE_RATIO = 0.15;

export function useRevealOnScroll(): void {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= VISIBLE_RATIO) entry.target.classList.add('is-revealed');
          else if (!entry.isIntersecting) entry.target.classList.remove('is-revealed');
        }
      },
      { threshold: [0, VISIBLE_RATIO] },
    );
    for (const element of document.querySelectorAll('.reveal')) observer.observe(element);
    return () => observer.disconnect();
  }, []);
}
