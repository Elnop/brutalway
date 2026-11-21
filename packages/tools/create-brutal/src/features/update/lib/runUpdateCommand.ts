import { checkProject } from '#src/features/update/lib/checkProject.ts';
import { npxRenderer } from '#src/features/update/lib/npxRenderer.ts';
import { readUpdateArgs } from '#src/features/update/lib/readUpdateArgs.ts';
import { reportUpdate } from '#src/features/update/lib/reportUpdate.ts';
import { startState } from '#src/features/update/lib/startState.ts';
import { updateProject } from '#src/features/update/lib/updateProject.ts';
import type { Renderer, UpdateTools } from '#src/features/update/UpdateTypes.ts';
import { runCommand } from '#src/shared/command/runCommand.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

type CommandPlan = { from: BrutalwayState; to: BrutalwayState; attach: boolean; render: Renderer };

function rendererOf(tools: UpdateTools, local: boolean): Renderer {
  return async function render(state, target) {
    if (state.createBrutal === tools.version) return tools.renderCurrent(state, target, local);
    return npxRenderer(state, target);
  };
}

async function planOf(
  command: 'update' | 'check',
  argv: string[],
  dir: string,
  tools: UpdateTools,
): Promise<CommandPlan> {
  const args = readUpdateArgs(argv);
  const { state: from, attach } = startState(dir, args);
  const version =
    command === 'check'
      ? runCommand('npm', ['view', 'create-brutal', 'version'], dir, true).trim()
      : (args.to ?? tools.version);
  const options = await tools.resolveOptions(from.stack, { ...from.options, ...args.set });
  return {
    from,
    to: { ...from, createBrutal: version, options },
    attach,
    render: rendererOf(tools, args.local),
  };
}

export async function runUpdateCommand(
  command: 'update' | 'check',
  argv: string[],
  tools: UpdateTools,
): Promise<number> {
  const dir = process.cwd();
  const { from, to, attach, render } = await planOf(command, argv, dir, tools);
  if (command === 'check') return checkProject(from, to, render);
  reportUpdate(await updateProject({ projectDir: dir, from, to, render, attach }), from, to);
  return 0;
}
