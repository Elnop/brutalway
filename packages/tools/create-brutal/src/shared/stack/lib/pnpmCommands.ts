import {
  DLX_PACKAGES,
  NPM_CI,
  NPM_SUBCOMMANDS,
  NPX,
  PNPM_ACTION,
  SETUP_NODE,
} from '#src/shared/stack/configs/PackageManagerConfig.ts';

function runsOnce(spec: string): boolean {
  return spec.indexOf('@', 1) !== -1 || DLX_PACKAGES.includes(spec);
}

export function pnpmCommands(text: string): string {
  return text
    .replaceAll(NPM_CI, 'pnpm install --frozen-lockfile')
    .replaceAll(NPM_SUBCOMMANDS, 'pnpm $1')
    .replaceAll(NPX, (_match, spec: string) =>
      runsOnce(spec) ? `pnpm dlx ${spec}` : `pnpm exec ${spec}`,
    )
    .replaceAll('cache: npm', 'cache: pnpm')
    .replaceAll(SETUP_NODE, (line, indent: string) => `${indent}- uses: ${PNPM_ACTION}\n${line}`);
}
