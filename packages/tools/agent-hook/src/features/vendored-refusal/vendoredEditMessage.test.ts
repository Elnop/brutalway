import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { vendoredEditMessage } from '#src/features/vendored-refusal/vendoredEditMessage.ts';

describe('vendoredEditMessage', () => {
  it('refuses an edit under a vendored folder with what to do instead', () => {
    const message = vendoredEditMessage('/repo', '/repo/third-party/shadcn/button.tsx', [
      'third-party',
    ]);
    assert.match(
      message ?? '',
      /^third-party\/shadcn\/button\.tsx was copied from a registry into third-party\//u,
    );
    assert.match(message ?? '', /npx shadcn add button --overwrite/u);
    assert.match(message ?? '', /data-slot in src\/app\/globals\.css/u);
  });

  it('gives the generic message for another registry', () => {
    assert.match(
      vendoredEditMessage('/repo', '/repo/third-party/magic/orb.tsx', ['third-party/']) ?? '',
      /Run the registry's CLI again/u,
    );
  });

  it('leaves files outside the vendored folders alone', () => {
    assert.equal(
      vendoredEditMessage('/repo', '/repo/src/shared/ui/Panel.tsx', ['third-party']),
      undefined,
    );
    assert.equal(
      vendoredEditMessage('/repo', '/repo/third-party-notes.md', ['third-party']),
      undefined,
    );
    assert.equal(
      vendoredEditMessage('/repo', '/repo/third-party/shadcn/button.tsx', []),
      undefined,
    );
  });
});
