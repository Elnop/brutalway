import { CHECKSUMS, GITLEAKS_VERSION } from '#src/features/binary/BinaryConfig.ts';
import type { ReleaseAsset } from '#src/features/binary/BinaryTypes.ts';

export function releaseAsset(platform: string, arch: string): ReleaseAsset {
  const os = platform === 'win32' ? 'windows' : platform;
  const suffix = `${os}_${arch}${os === 'windows' ? '.zip' : '.tar.gz'}`;
  const sha256 = CHECKSUMS[suffix];
  if (sha256 === undefined) {
    throw new Error(
      `check-secrets: gitleaks ${GITLEAKS_VERSION} has no build for ${platform} ${arch}: install gitleaks and give its path in GITLEAKS_BIN`,
    );
  }
  return { name: `gitleaks_${GITLEAKS_VERSION}_${suffix}`, sha256 };
}
