import { checkSteps } from './checkSteps.ts';
import { packageFolders } from './packageFolders.ts';
import { runSteps } from './runSteps.ts';

process.exitCode = await runSteps(checkSteps(packageFolders()));
