export async function inPool<T, R>(items: T[], size: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let next = 0;
  async function work(): Promise<void> {
    const index = next;
    next += 1;
    const item = items[index];
    if (item === undefined) return;
    results[index] = await task(item);
    await work();
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => work()));
  return results;
}
