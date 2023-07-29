import { db } from "../src/data/db.utils";
import { getFeedItem } from "../src/data/utils";

const DB = db(1000, 10, getFeedItem);

describe("Mock Database", () => {
  test("it should return a cursor with chunk of data", async () => {
    const data = await DB.load(0, 10);
    expect(data).not.toBeNull();
    expect(data.chunk).toHaveLength(10);
    expect(data.size).toBe(10);
    expect(data.nextCursor).toBe(10);
    expect(data.prevCursor).toBe(0);
    // console.log(data.chunk);
  });
});
