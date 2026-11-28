export function split(name: string) {
  const backslash = 'a long text \
  that continues';
  const sameLine = 'a' + 'b';
  const twoLines =
    'a long text ' +
    'that continues';
  const chain = name + 'a long text ' +
    'that continues';
  const templates = `a long text ` +
    `that continues`;
  const mixed = 'Hello ' + name;
  const inTemplate = `a long text \
  that continues`;
  const tripleFirst = 'one ' + 'two ' + 'three';
  return [backslash, sameLine, twoLines, chain, templates, mixed, inTemplate, tripleFirst];
}
