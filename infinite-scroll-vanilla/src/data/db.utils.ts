export type CursorInfo<T> = {
  size: number;
  nextCursor: number;
  prevCursor: number;
  chunk: T[];
};
interface DB<T> {
  load: (start: number, limit: number) => Promise<CursorInfo<T>>;
}
export function db<T>(
  size: number = 100,
  pageSize: number = 10,
  getItem: (index: number) => T
): DB<T> {
  const items = Array(size)
    .fill(null)
    .map((_, index) => getItem(index));
  return {
    load: (start: number, limit: number = pageSize): Promise<CursorInfo<T>> => {
      const chunk = items.slice(start, start + limit);
      const cursorInfo: CursorInfo<T> = {
        size: chunk.length,
        nextCursor: start + limit,
        prevCursor: start,
        chunk,
      };
      return new Promise((resolve, reject) => resolve(cursorInfo));
    },
  };
}
