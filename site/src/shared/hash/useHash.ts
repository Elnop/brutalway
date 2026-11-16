import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash(): string {
  return window.location.hash;
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, readHash);
}
