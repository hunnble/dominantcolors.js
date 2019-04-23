import { IColorRange, IOptions } from "./interfaces";
import { ColorBox } from "./colorBox";
import { getColor } from "./helper";

interface IColorCount {
  color: number;
  count: number;
}

function getCutEdgeIdx(colorRange: IColorRange): number {
  const { red, green, blue } = colorRange;
  const edges: number[] = [
    red.max - red.min,
    green.max - green.min,
    blue.max - blue.min
  ];
  const maxEdge: number = Math.max(...edges);

  return edges.indexOf(maxEdge);
}

function getMedianColor(colorBox: ColorBox, cutEdgeIdx: number): number {
  const colors: Object = {};
  let colorCounts: IColorCount[] = [];
  let color: number;
  let total: number = 0;
  let medianIdx: number = 0;

  for (let i = 0; i < colorBox.total; i += 1) {
    color = colorBox.data[i * 4 + cutEdgeIdx];
    if (!colors[color]) {
      colors[color] = 1;
    } else {
      colors[color] += 1;
    }
  }
  for (const key in colors) {
    color = parseInt(key, 10);
    if (color !== 0) {
      colorCounts.push({
        color,
        count: colors[key]
      });
    }
  }
  colorCounts.sort((prev, next) => prev.count - next.count);
  for (let i = 0; i < colorCounts.length; i += 1) {
    total += colorCounts[i].count;
    if (total >= colorBox.total / 2 || i === colorCounts.length - 1) {
      medianIdx = i;
      break;
    }
  }

  return colorCounts[medianIdx].color;
}

function cutBox(colorBox: ColorBox): ColorBox[] {
  const cutEdgeIdx: number = getCutEdgeIdx(colorBox.colorRange);
  const medianColor: number = getMedianColor(colorBox, cutEdgeIdx);
  let leftData: number[] = [];
  let rightData: number[] = [];
  let targetData: number[];
  for (let i = 0; i < colorBox.total; i += 1) {
    if (colorBox.data[i * 4 + cutEdgeIdx] < medianColor) {
      targetData = leftData;
    } else if (colorBox.data[i * 4 + cutEdgeIdx] > medianColor) {
      targetData = rightData;
    } else {
      targetData = leftData.length < rightData.length ? leftData : rightData;
    }
    targetData.push(colorBox.data[i * 4]);
    targetData.push(colorBox.data[i * 4 + 1]);
    targetData.push(colorBox.data[i * 4 + 2]);
    targetData.push(colorBox.data[i * 4 + 3]);
  }
  const leftBox: ColorBox = new ColorBox(leftData);
  const rightBox: ColorBox = new ColorBox(rightData);

  return [leftBox, rightBox];
}

export default function medianCut(
  data: Uint8ClampedArray | number[],
  options: IOptions
) {
  const { count, colorFormat } = options;
  let colorBox: ColorBox = new ColorBox(data);
  let boxes: ColorBox[] = [colorBox];

  while (boxes.length < count) {
    boxes.sort((prev, next) => prev.rank - next.rank);
    colorBox = boxes.pop();
    const cutBoxes: ColorBox[] = cutBox(colorBox);
    boxes = boxes.concat(cutBoxes);
  }

  return boxes.slice(0, count).map(box => getColor(box.data, colorFormat));
}
