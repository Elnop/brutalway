export function parseJson(text: string | undefined, file: string): unknown {
  if (text === undefined) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`check-exceptions: ${file} is not valid JSON`);
  }
}
