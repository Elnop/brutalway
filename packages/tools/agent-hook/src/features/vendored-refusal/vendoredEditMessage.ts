import { basename, extname, relative } from 'node:path';
import { vendoredFolder } from '#src/shared-features/vendored/vendoredFolder.ts';

export function vendoredEditMessage(root: string, file: string, vendored: string[]): string | undefined {
  const fromRoot = relative(root, file);
  const folder = vendoredFolder(fromRoot, vendored);
  if (folder === undefined) return undefined;
  const intro = `${fromRoot} was copied from a registry into ${folder}/ and is never edited by hand, so the registry can replace it at any time.`;
  if (!fromRoot.startsWith(`${folder}/shadcn/`)) return `${intro} Run the registry's CLI again to update it, and write your own code in src/.`;
  const name = basename(fromRoot, extname(fromRoot));
  return [
    intro,
    `To update it, run npx shadcn add ${name} --overwrite.`,
    'To change how it looks, edit the tokens or add a rule on its data-slot in src/app/globals.css, or pass a class from the component that uses it.',
    'For a variant shadcn does not have, write a component in src/ that wraps it.',
  ].join(' ');
}
