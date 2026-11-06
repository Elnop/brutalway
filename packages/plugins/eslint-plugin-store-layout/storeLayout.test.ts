import { ruleTester } from '@brutal/lint-utils/ruleTester';
import { storeLayout } from './storeLayout.ts';

ruleTester.run('store-layout', storeLayout, {
  valid: [
    { filename: 'src/stores/viewStore.ts', code: 'export const viewStore = create(); export const viewActions = {};' },
    { filename: 'src/sceneStore.ts', code: 'export const sceneStore = create();' },
    { filename: 'src/lib/useView.ts', code: 'export function useView() {}' },
  ],
  invalid: [
    {
      filename: 'src/stores/viewStore.ts',
      code: 'export const viewStore = create(); export function useView() {}',
      errors: [{ messageId: 'foreignExport', data: { file: 'viewStore.ts', store: 'viewStore', actions: 'viewActions', name: 'useView' } }],
    },
    { filename: 'src/stores/viewStore.ts', code: 'export const store = create();', errors: [{ messageId: 'foreignExport' }, { messageId: 'missingStore' }] },
    {
      filename: 'src/stores/viewStore.js',
      code: 'export const store = create();',
      errors: [{ message: 'viewStore.js only exports viewStore and viewActions: move store out of it.' }, { message: 'viewStore.js must export viewStore.' }],
    },
  ],
});
