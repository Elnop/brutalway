import { useRef } from 'react';
import { useHideOnScrollDown } from '@/features/site/features/header/useHideOnScrollDown.ts';
import { DOCS_ROUTE, REPOSITORY_URL, TEMPLATES_ROUTE } from '@/shared/LinksConfig.ts';
import '@/features/site/features/header/header.css';
import { SiteLink } from '@/shared/presenters/SiteLink.tsx';

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const isHidden = useHideOnScrollDown(headerRef);
  return (
    <header ref={headerRef} className={isHidden ? 'site-header is-hidden' : 'site-header'}>
      <nav aria-label="Main" className="site-header-nav container">
        <a href="#top" className="site-header-logo">
          <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
            <rect x="9" y="9" width="27" height="27" fill="#ffd23f" stroke="#111111" strokeWidth="3" />
            <rect x="2" y="2" width="27" height="27" fill="#111111" />
            <text x="15.5" y="23" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="19" fill="#fffdf5">
              B
            </text>
          </svg>
          brutalway
        </a>
        <div className="site-header-links">
          <div className="site-header-sections">
            <a href="#axioms">Axioms</a>
            <a href="#authors">Authors</a>
            <a href="#stacks">Stacks</a>
          </div>
          <div className="site-header-pages">
            <a href={DOCS_ROUTE}>Docs</a>
            <a href={TEMPLATES_ROUTE}>Templates</a>
            <SiteLink href={REPOSITORY_URL}>GitHub</SiteLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
