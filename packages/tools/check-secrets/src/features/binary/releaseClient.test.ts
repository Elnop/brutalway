import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { releaseClient } from '#src/features/binary/releaseClient.ts';

const BODY = 'gitleaks archive';
const SHA256 = createHash('sha256').update(BODY).digest('hex');
const server = createServer((request, response) => {
  response.statusCode = request.url === '/archive' ? 200 : 404;
  response.end(BODY);
});

function url(path: string): string {
  const address = server.address();
  return `http://127.0.0.1:${typeof address === 'object' && address !== null ? address.port : 0}${path}`;
}

describe('releaseClient.verifiedDownload', () => {
  before(() => new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve)));
  after(() => server.close());

  it('returns the bytes when they match the pinned checksum', async () => {
    assert.equal((await releaseClient.verifiedDownload(url('/archive'), SHA256)).toString(), BODY);
  });

  it('refuses bytes that do not match the pinned checksum, and an error status', async () => {
    await assert.rejects(
      releaseClient.verifiedDownload(url('/archive'), '0'.repeat(64)),
      /does not match its pinned checksum/u,
    );
    await assert.rejects(releaseClient.verifiedDownload(url('/missing'), SHA256), /answered 404/u);
  });
});
