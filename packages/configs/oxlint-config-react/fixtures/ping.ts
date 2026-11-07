export async function ping() {
  return fetch('/api/ping');
}
