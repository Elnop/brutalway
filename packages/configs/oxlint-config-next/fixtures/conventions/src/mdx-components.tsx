import type { ReactNode } from 'react';

type MdxComponents = Record<string, (props: { children?: ReactNode }) => ReactNode>;

export function useMDXComponents(): MdxComponents {
  return {};
}
