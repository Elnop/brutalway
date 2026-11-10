import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { describe, it } from 'node:test';
import { linkClient, statusVerdict } from '#src/features/remote-links/linkClient.ts';

describe('linkClient', () => {
  it('404 and 410 are dead, other errors are unsure, the rest is alive', () => {
    assert.deepEqual(
      [200, 301, 404, 410, 403, 429, 500].map((status) => statusVerdict(status)),
      ['alive', 'alive', 'dead', 'dead', 'unsure', 'unsure', 'unsure'],
    );
  });

  it('a page that refuses HEAD is asked again with GET', async () => {
    const server = createServer((request, response) => {
      response.statusCode = request.method === 'HEAD' ? 405 : 200;
      response.end();
    }).listen(0);
    await once(server, 'listening');
    const address = server.address();
    assert.ok(typeof address === 'object' && address !== null);
    assert.deepEqual(await linkClient.requestUrl(`http://127.0.0.1:${address.port}/page`), {
      verdict: 'alive',
      reason: 'status 200',
    });
    server.close();
  });

  it('a domain that does not exist is dead', async () => {
    assert.deepEqual(await linkClient.requestUrl('https://check-doc-links.invalid/'), {
      verdict: 'dead',
      reason: 'the domain does not exist',
    });
  });
});
