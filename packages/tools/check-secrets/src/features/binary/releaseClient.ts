import { createHash } from 'node:crypto';

export const releaseClient = {
  async verifiedDownload(url: string, sha256: string): Promise<Buffer> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      throw new Error(
        `check-secrets: could not download ${url}: check the connection, or give the path of a gitleaks binary in GITLEAKS_BIN`,
      );
    }
    if (!response.ok) throw new Error(`check-secrets: ${url} answered ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const found = createHash('sha256').update(bytes).digest('hex');
    if (found !== sha256) {
      throw new Error(
        `check-secrets: ${url} does not match its pinned checksum (${found} instead of ${sha256}), nothing was run`,
      );
    }
    return bytes;
  },
};
