import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isVendored, vendoredEditMessage } from './vendoredEdit.ts';

test('an edit under a vendored folder is refused with what to do instead', () => {
  const message = vendoredEditMessage('/repo', '/repo/third-party/shadcn/button.tsx', ['third-party']);
  assert.match(message ?? '', /^third-party\/shadcn\/button\.tsx was copied from a registry into third-party\//u);
  assert.match(message ?? '', /npx shadcn add button --overwrite/u);
  assert.match(message ?? '', /data-slot in src\/app\/globals\.css/u);
});

test('another registry gets the generic message', () => {
  assert.match(vendoredEditMessage('/repo', '/repo/third-party/magic/orb.tsx', ['third-party/']) ?? '', /Run the registry's CLI again/u);
});

test('files outside the vendored folders are left alone', () => {
  assert.equal(vendoredEditMessage('/repo', '/repo/src/shared/ui/Panel.tsx', ['third-party']), undefined);
  assert.equal(vendoredEditMessage('/repo', '/repo/third-party-notes.md', ['third-party']), undefined);
  assert.equal(vendoredEditMessage('/repo', '/repo/third-party/shadcn/button.tsx', []), undefined);
  assert.equal(isVendored('/repo', '/repo/third-party/shadcn/button.tsx', ['third-party']), true);
});
