import { STATE_FILE } from '#src/shared/stack/configs/StateConfig.ts';

export const MERGED_SEPARATELY = [
  STATE_FILE,
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
];

export const GIT_IDENTITY = [
  '-c',
  'user.name=create-brutal',
  '-c',
  'user.email=create-brutal@localhost',
  '-c',
  'commit.gpgsign=false',
];
