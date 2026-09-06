/**
 * Executes an async iterator function over an array of items with a concurrency pool limit.
 *
 * @param items Array of items to process.
 * @param limit Maximum number of concurrent tasks executing simultaneously.
 * @param iteratorFn Async worker function for each item.
 * @returns Promise resolving to an array of results in the original item order.
 */
export async function runPool<T, R>(
  items: T[],
  limit: number,
  iteratorFn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    results.push(p as unknown as R);

    const e: Promise<void> = p.then(() => {
      const idx = executing.indexOf(e);
      if (idx !== -1) executing.splice(idx, 1);
    });
    executing.push(e);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
