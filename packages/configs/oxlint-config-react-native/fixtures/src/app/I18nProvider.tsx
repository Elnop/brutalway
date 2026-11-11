import type { ReactNode } from 'react';

type I18nProviderProps = { children: ReactNode };

export default function Provider({ children }: I18nProviderProps) {
  return children;
}
