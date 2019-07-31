import test from "ava";
import dc from "../src";

test("not get any colors when giving empty image data", async t => {
  const colors = await dc([]);
  t.deepEqual(colors, []);
});
