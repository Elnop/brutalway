export async function register(): Promise<void> {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    process.stdout.write('ready\n');
  }
}
