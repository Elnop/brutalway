import type { ComponentProps } from 'react';

const EXTERNAL_URL = /^https?:\/\//iu;

export function SiteLink({ href, ...props }: ComponentProps<'a'>) {
  const opensInNewTab = href !== undefined && EXTERNAL_URL.test(href);
  return <a href={href} {...(opensInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props} />;
}
