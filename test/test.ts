import test from "ava";
import dc from "../src";
import { ColorBox, MAX_COLOR, MIN_COLOR } from "../src/colorBox";

test("not get any colors when giving empty image data", async t => {
  const colors = await dc([]);
  t.deepEqual(colors, []);
});

// TODO: run functions in Node environment
// test("get olors when giving real image data", async t => {
//   const colors = await dc('../example/images/example.png');
//   t.deepEqual(colors, []);
// });

test("Each colorBox's color ranges should in the correct interval", t => {
  const colorBox = new ColorBox([]);
  const { red, green, blue } = colorBox.colorRange;
  t.plan(6);
  t.truthy(red.min <= MAX_COLOR);
  t.truthy(green.min <= MAX_COLOR);
  t.truthy(blue.min <= MAX_COLOR);
  t.truthy(red.max >= MIN_COLOR);
  t.truthy(green.max >= MIN_COLOR);
  t.truthy(blue.max >= MIN_COLOR);
});

test("Each colorBox's rank should greater or equal to 0", t => {
  const colorBox = new ColorBox([]);
  t.truthy(colorBox.rank >= 0);
});
