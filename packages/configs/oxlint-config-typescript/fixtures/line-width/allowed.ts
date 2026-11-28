export function allowed(name: string, count: number) {
  const sum = count + 1;
  const joined = `Hello ${name}`;
  const lines = `first line
second line`;
  const parts = ['a', 'b'].join(' ');
  const numeric = 1 + 2;
  return [sum, joined, lines, parts, numeric, name + count];
}
