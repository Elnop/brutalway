import { useEffect, useState } from 'react';
import type { CopyStatus } from '@/shared/ClipboardTypes.ts';

const STATUS_DURATION_MS = 2000;

export function useCopyToClipboard(text: string): { status: CopyStatus; copy: () => void } {
  const [status, setStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (status === 'idle') return undefined;
    const timer = window.setTimeout(() => setStatus('idle'), STATUS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  function copy(): void {
    navigator.clipboard.writeText(text).then(
      () => setStatus('copied'),
      () => setStatus('failed'),
    );
  }

  return { status, copy };
}
