export async function register(): Promise<void> {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') process.stdout.write('ready\n');
}

export function onRequestError(error: unknown): void {
  process.stderr.write(`${String(error)}\n`);
}
