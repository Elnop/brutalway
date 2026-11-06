import type { CopyStatus } from '@/shared/ClipboardTypes.ts';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard.ts';

const COMMAND = 'npm create brutal my-app';

const STATUS_LABELS: Record<CopyStatus, string> = {
  idle: 'copy',
  copied: 'copied',
  failed: 'failed',
};

type CommandLineProps = {
  shadow: 'yellow' | 'paper';
};

export function CommandLine({ shadow }: CommandLineProps) {
  const { status, copy } = useCopyToClipboard(COMMAND);
  return (
    <button type="button" className={`command command-${shadow}`} onClick={copy} aria-label={`Copy ${COMMAND}`}>
      <code>{COMMAND}</code>
      <span className={`command-status command-status-${status}`} aria-live="polite">
        {STATUS_LABELS[status]}
      </span>
    </button>
  );
}
