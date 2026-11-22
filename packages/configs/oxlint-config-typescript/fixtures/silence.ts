export function silence(): number {
  // @ts-ignore
  const ignored: number = '1';
  // @ts-expect-error
  const bare: number = '2';
  // @ts-expect-error: the value is checked at runtime
  const explained: number = '3';
  const built = new Function('return 1');
  return ignored + bare + explained + Number(built());
}
