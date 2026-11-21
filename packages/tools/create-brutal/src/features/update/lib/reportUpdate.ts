import { log } from '@clack/prompts';
import type { UpdateResult } from '#src/features/update/UpdateTypes.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

export function reportUpdate(result: UpdateResult, from: BrutalwayState, to: BrutalwayState): void {
  if (result.attached !== undefined) {
    log.info(
      `${String(result.attached.identical)} of the ${String(result.attached.total)} files of create-brutal ${from.createBrutal} are unchanged in the project`,
    );
  }
  for (const file of result.conflicts) log.warn(`conflict in ${file}: resolve it, then git add it`);
  for (const key of result.packageConflicts) {
    log.warn(
      `package.json: ${key} changed in the project and in the template, the project's value was kept`,
    );
  }
  log.success(
    `updated to create-brutal ${to.createBrutal}: review the changes, run npm install and npm run check, then commit`,
  );
}
