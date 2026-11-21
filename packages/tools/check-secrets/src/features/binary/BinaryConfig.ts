export const GITLEAKS_VERSION = '8.30.1';

export const RELEASE_URL = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}`;

export const CHECKSUMS: Readonly<Record<string, string>> = {
  'darwin_arm64.tar.gz': 'b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5',
  'darwin_x64.tar.gz': 'dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709',
  'linux_arm64.tar.gz': 'e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080',
  'linux_x64.tar.gz': '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
  'windows_arm64.zip': 'b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f',
  'windows_x64.zip': 'd29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e',
};

export const CACHE_FOLDER = `node_modules/.cache/check-secrets/${GITLEAKS_VERSION}`;
