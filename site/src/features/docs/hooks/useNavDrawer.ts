import { useCallback, useEffect, useState } from 'react';
import type { NavDrawer } from '@/features/docs/DocsTypes.ts';

function closeOnEscapeAndNavigation(close: () => void): () => void {
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('hashchange', close);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('hashchange', close);
  };
}

export function useNavDrawer(): NavDrawer {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((wasOpen) => !wasOpen), []);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => (open ? closeOnEscapeAndNavigation(close) : undefined), [open, close]);
  return { open, toggle, close };
}
