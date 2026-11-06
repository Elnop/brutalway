import { CommandLine } from '@/shared/CommandLine.tsx';
import '@/features/site/features/footer/footer.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <p className="site-footer-motto">Nothing left to memory.</p>
        <CommandLine shadow="paper" />
      </div>
    </footer>
  );
}
