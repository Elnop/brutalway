declare function create(initial: object): object;

export type ViewState = { open: boolean };
export const viewStore = create({ open: false });
export const viewActions = { toggle: () => 1 };
export const stray = 2;
