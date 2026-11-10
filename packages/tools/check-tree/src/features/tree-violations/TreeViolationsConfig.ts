import type { FileGroup } from '#src/features/tree-violations/TreeViolationsTypes.ts';

export const DEFAULT_CATEGORY_FOLDERS = [
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
  'keys',
  'schemas',
  'clients',
  'workers',
  'lib',
];
export const TEST_FILE = /\.test\.tsx?$/u;
const NAMED_FILE =
  /^use[A-Z]|(?:Types|Config|Store|Routes|Service|Queries|Keys|Schemas|Client|Worker|Env)\.ts$|Content\.tsx?$|\.d\.ts$/u;
const COMPONENT_FILE = /^[A-Z]\w*\.tsx$/u;
const ORCHESTRATOR_FILE = /(?:Container|Layout|Page)\.tsx$/u;
const COMPONENT_FOLDERS = new Set(['components', 'orchestrators', 'presenters']);

function isComponent(fileName: string) {
  return COMPONENT_FILE.test(fileName) && !NAMED_FILE.test(fileName);
}

function outsideOwnFolder(folder: string) {
  return (folderName: string) => folderName !== folder;
}

export const FILE_GROUPS: FileGroup[] = [
  {
    folder: 'components',
    belongs: isComponent,
    appliesIn: (folderName) => !COMPONENT_FOLDERS.has(folderName),
  },
  {
    folder: 'orchestrators',
    belongs: (fileName) => isComponent(fileName) && ORCHESTRATOR_FILE.test(fileName),
    appliesIn: (folderName) => folderName === 'components',
  },
  {
    folder: 'presenters',
    belongs: (fileName) => isComponent(fileName) && !ORCHESTRATOR_FILE.test(fileName),
    appliesIn: (folderName) => folderName === 'components',
  },
  {
    folder: 'hooks',
    belongs: (fileName) => /^use[A-Z]\w*\.tsx?$/u.test(fileName),
    appliesIn: outsideOwnFolder('hooks'),
  },
  {
    folder: 'styles',
    belongs: (fileName) => fileName.endsWith('.css') && !fileName.endsWith('.module.css'),
    appliesIn: outsideOwnFolder('styles'),
  },
  {
    folder: 'types',
    belongs: (fileName) => fileName.endsWith('Types.ts'),
    appliesIn: outsideOwnFolder('types'),
  },
  {
    folder: 'configs',
    belongs: (fileName) => fileName.endsWith('Config.ts'),
    appliesIn: outsideOwnFolder('configs'),
  },
  {
    folder: 'stores',
    belongs: (fileName) => fileName.endsWith('Store.ts'),
    appliesIn: outsideOwnFolder('stores'),
  },
  {
    folder: 'routes',
    belongs: (fileName) => fileName.endsWith('Routes.ts'),
    appliesIn: outsideOwnFolder('routes'),
  },
  {
    folder: 'services',
    belongs: (fileName) => fileName.endsWith('Service.ts'),
    appliesIn: outsideOwnFolder('services'),
  },
  {
    folder: 'queries',
    belongs: (fileName) => fileName.endsWith('Queries.ts'),
    appliesIn: outsideOwnFolder('queries'),
  },
  {
    folder: 'keys',
    belongs: (fileName) => fileName.endsWith('Keys.ts'),
    appliesIn: outsideOwnFolder('keys'),
  },
  {
    folder: 'schemas',
    belongs: (fileName) => fileName.endsWith('Schemas.ts'),
    appliesIn: outsideOwnFolder('schemas'),
  },
  {
    folder: 'clients',
    belongs: (fileName) => fileName.endsWith('Client.ts'),
    appliesIn: outsideOwnFolder('clients'),
  },
  {
    folder: 'workers',
    belongs: (fileName) => fileName.endsWith('Worker.ts'),
    appliesIn: outsideOwnFolder('workers'),
  },
  {
    folder: 'lib',
    belongs: (fileName) => fileName.endsWith('.ts') && !NAMED_FILE.test(fileName),
    appliesIn: outsideOwnFolder('lib'),
  },
];
