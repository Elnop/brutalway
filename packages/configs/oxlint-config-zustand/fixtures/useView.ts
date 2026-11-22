import { viewStore } from './viewStore.ts';
import { selectCount } from './cartSelectors.ts';

declare function useStore(store: object, selector?: (state: never) => unknown): unknown;
declare function useCartStore(selector?: (state: never) => unknown): unknown;

export function useView(): unknown[] {
  return [
    useStore(viewStore),
    useStore(viewStore, selectCount),
    useCartStore(),
    useCartStore(selectCount),
  ];
}
