export function createTodoSyncClient() {
  return { send: async () => fetch('https://example.com') };
}
