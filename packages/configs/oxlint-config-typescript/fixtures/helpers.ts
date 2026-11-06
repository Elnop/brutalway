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
// a comment
