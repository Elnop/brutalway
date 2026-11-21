import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { releaseAsset } from '#src/features/binary/lib/releaseAsset.ts';

describe('releaseAsset', () => {
  it('names the archive of the platform with its pinned checksum', () => {
    assert.deepEqual(releaseAsset('linux', 'x64'), {
      name: 'gitleaks_8.30.1_linux_x64.tar.gz',
      sha256: '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
    });
    assert.equal(releaseAsset('win32', 'x64').name, 'gitleaks_8.30.1_windows_x64.zip');
  });

  it('points to GITLEAKS_BIN on a platform gitleaks has no build for', () => {
    assert.throws(() => releaseAsset('freebsd', 'x64'), /give its path in GITLEAKS_BIN/u);
  });
});
