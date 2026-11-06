declare function create(initial: object): object;

export const viewStore = create({ open: false });
export const viewActions = { toggle: () => 1 };
export const stray = 2;
