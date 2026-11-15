import type { ReactNode } from 'react';

type MarketingTemplateProps = { children: ReactNode };

export default function MarketingTemplate({ children }: MarketingTemplateProps) {
  return <div>{children}</div>;
}
