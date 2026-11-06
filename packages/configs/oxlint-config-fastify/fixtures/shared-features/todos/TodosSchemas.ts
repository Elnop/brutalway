type Schema = { parse: (value: unknown) => unknown };
const z = { object: (shape: object): Schema => ({ parse: () => shape }) };

export const TodoSchema = z.object({});

export function parseTodo(value: unknown) {
  return TodoSchema.parse(value);
}
