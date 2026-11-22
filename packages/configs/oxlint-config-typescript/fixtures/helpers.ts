declare function defineThing(options: object): object;

export type Shape = { side: number };
export const LIMIT = 3;
export const plain = { side: 1 };
export const arrows = { area: () => 1 };
export const functions = {
  area: function () {
    return 1;
  },
};
export const methods = {
  area() {
    return 1;
  },
};
export const thing = defineThing({});
export const nestedFactory = { notes: { all: () => ['notes'] } };
export const nestedPlain = { notes: { all: ['notes'] } };
export const nestedAsConst = { notes: { all: () => ['notes'] } } as const;
export const nestedSatisfies = { notes: { all: () => ['notes'] } } satisfies Record<string, object>;
export const plainAsConst = { notes: { all: ['notes'] } } as const;
// a comment
