type CartState = { items: number[] };
export function selectCount(state: CartState) {
  return state.items.length;
}
export function countItems(state: CartState) {
  return state.items.length;
}
