import { readdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const DEFAULT_CATEGORY_FOLDERS = [
  'components',
  'orchestrators',
  'presenters',
  'hooks',
  'styles',
  'types',
  'configs',
  'stores',
  'routes',
  'services',
  'queries',
  'schemas',
  'clients',
  'workers',
  'lib',
];
const TEST_FILE = /\.test\.tsx?$/u;
const NAMED_FILE = /^use[A-Z]|(?:Types|Config|Store|Routes|Service|Queries|Schemas|Client|Worker|Env)\.ts$|Content\.tsx?$|\.d\.ts$/u;
const COMPONENT_FILE = /^[A-Z]\w*\.tsx$/u;
const ORCHESTRATOR_FILE = /(?:Container|Layout|Page)\.tsx$/u;
const COMPONENT_FOLDERS = new Set(['components', 'orchestrators', 'presenters']);

type FileGroup = { folder: string; belongs: (fileName: string) => boolean; appliesIn: (folderName: string) => boolean };

function isComponent(fileName: string) {
  return COMPONENT_FILE.test(fileName) && !NAMED_FILE.test(fileName);
}

function outsideOwnFolder(folder: string) {
  return (folderName: string) => folderName !== folder;
}

const FILE_GROUPS: FileGroup[] = [
  { folder: 'components', belongs: isComponent, appliesIn: (folderName) => !COMPONENT_FOLDERS.has(folderName) },
  { folder: 'orchestrators', belongs: (fileName) => isComponent(fileName) && ORCHESTRATOR_FILE.test(fileName), appliesIn: (folderName) => folderName === 'components' },
  { folder: 'presenters', belongs: (fileName) => isComponent(fileName) && !ORCHESTRATOR_FILE.test(fileName), appliesIn: (folderName) => folderName === 'components' },
  { folder: 'hooks', belongs: (fileName) => /^use[A-Z]\w*\.tsx?$/u.test(fileName), appliesIn: outsideOwnFolder('hooks') },
  { folder: 'styles', belongs: (fileName) => fileName.endsWith('.css'), appliesIn: outsideOwnFolder('styles') },
  { folder: 'types', belongs: (fileName) => fileName.endsWith('Types.ts'), appliesIn: outsideOwnFolder('types') },
  { folder: 'configs', belongs: (fileName) => fileName.endsWith('Config.ts'), appliesIn: outsideOwnFolder('configs') },
  { folder: 'stores', belongs: (fileName) => fileName.endsWith('Store.ts'), appliesIn: outsideOwnFolder('stores') },
  { folder: 'routes', belongs: (fileName) => fileName.endsWith('Routes.ts'), appliesIn: outsideOwnFolder('routes') },
  { folder: 'services', belongs: (fileName) => fileName.endsWith('Service.ts'), appliesIn: outsideOwnFolder('services') },
  { folder: 'queries', belongs: (fileName) => fileName.endsWith('Queries.ts'), appliesIn: outsideOwnFolder('queries') },
  { folder: 'schemas', belongs: (fileName) => fileName.endsWith('Schemas.ts'), appliesIn: outsideOwnFolder('schemas') },
  { folder: 'clients', belongs: (fileName) => fileName.endsWith('Client.ts'), appliesIn: outsideOwnFolder('clients') },
  { folder: 'workers', belongs: (fileName) => fileName.endsWith('Worker.ts'), appliesIn: outsideOwnFolder('workers') },
  { folder: 'lib', belongs: (fileName) => fileName.endsWith('.ts') && !NAMED_FILE.test(fileName), appliesIn: outsideOwnFolder('lib') },
];

function groupViolations(name: string, folderName: string, fileNames: string[], folderNames: ReadonlySet<string>, categoryFolders: ReadonlySet<string>): string[] {
  const violations: string[] = [];
  for (const { folder, belongs, appliesIn } of FILE_GROUPS) {
    if (!categoryFolders.has(folder) || !appliesIn(folderName)) continue;
    const loose = fileNames.filter(belongs);
    if (loose.length === 0) continue;
    if (folderNames.has(folder)) violations.push(`${name} has a ${folder}/ folder: move ${loose.join(', ')} into it`);
    else if (loose.length > 1) violations.push(`${name} holds ${loose.length} ${folder} files (${loose.join(', ')}): move them into ${folder}/`);
  }
  return violations;
}

function folderViolations(folder: string, name: string, categoryFolders: ReadonlySet<string>): string[] {
  const entries = readdirSync(folder, { withFileTypes: true });
  const children = entries.filter((entry) => !TEST_FILE.test(entry.name));
  const fileNames = children
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .toSorted();
  const folderNames = new Set(children.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  const violations: string[] = [];
  if (children.length === 0) violations.push(`${name} is empty: delete it`);
  if (children.length === 1 && categoryFolders.has(basename(folder))) violations.push(`${name} holds a single child: move it up one level and delete the folder`);
  return [...violations, ...groupViolations(name, basename(folder), fileNames, folderNames, categoryFolders)];
}

export function treeViolations(root: string, categoryFolders: readonly string[] = DEFAULT_CATEGORY_FOLDERS): string[] {
  const categories = new Set(categoryFolders);
  function walk(folder: string): string[] {
    return [
      ...folderViolations(folder, relative(join(root, '..'), folder), categories),
      ...readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => walk(join(folder, entry.name))),
    ];
  }
  return walk(root);
}
