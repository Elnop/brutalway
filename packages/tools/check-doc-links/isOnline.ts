import { ONLINE_PROBE_URL } from './DocLinksConfig.ts';

export async function isOnline(): Promise<boolean> {
  try {
    const response = await fetch(ONLINE_PROBE_URL, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
    await response.body?.cancel();
    return true;
  } catch {
    return false;
  }
}
