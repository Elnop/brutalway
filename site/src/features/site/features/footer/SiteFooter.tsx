import { NEW_ISSUE_URL, PULL_REQUESTS_URL } from '@/shared/configs/LinksConfig.ts';
import { CommandLine } from '@/shared/presenters/CommandLine.tsx';
import { SiteLink } from '@/shared/presenters/SiteLink.tsx';
import '@/features/site/features/footer/footer.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <p className="site-footer-motto">Nothing left to memory.</p>
        <CommandLine shadow="paper" />
        <p className="site-footer-contribute">
          A rule you miss, a check that fails on valid code, a stack to add: anyone can{' '}
          <SiteLink href={NEW_ISSUE_URL}>open an issue</SiteLink> or{' '}
          <SiteLink href={PULL_REQUESTS_URL}>a pull request</SiteLink>.
        </p>
      </div>
    </footer>
  );
}
