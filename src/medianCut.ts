import { getRGBFromData } from "./helper";

const MIN_COLOR = 0;
const MAX_COLOR = 255;

interface IColorRange {
  red: {
    min: number;
    max: number;
  };
  green: {
    min: number;
    max: number;
  };
  blue: {
    min: number;
    max: number;
  };
}

interface IColorCount {
  color: number;
  count: number;
}

export class ColorBox {
  public data;
  public rank: number;
  public colorRange: IColorRange;
  public total: number;
  private getColorRange: Function = getColorRange;
  public getVolume: Function = getVolume;

  constructor(data) {
    this.data = data;
    this.total = data.length / 4;
    this.colorRange = this.getColorRange(data);
    this.rank = this.getVolume(this.colorRange) * this.total;
  }
}

function getColorRange(data): IColorRange {
  const pixelCount: number = data.length / 4;
  let minRed: number = MAX_COLOR;
  let maxRed: number = MIN_COLOR;
  let minGreen: number = MAX_COLOR;
  let maxGreen: number = MIN_COLOR;
  let minBlue: number = MAX_COLOR;
  let maxBlue: number = MIN_COLOR;

  for (let i = 0; i < pixelCount; i += 1) {
    const { redData, greenData, blueData } = getRGBFromData(data, i);

    minRed = redData < minRed ? redData : minRed;
    maxRed = redData > maxRed ? redData : maxRed;
    minGreen = greenData < minGreen ? redData : minGreen;
    maxGreen = greenData > maxGreen ? redData : maxGreen;
    minBlue = blueData < minBlue ? redData : minBlue;
    maxBlue = blueData > maxBlue ? redData : maxBlue;
  }

  return {
    red: {
      min: minRed,
      max: maxRed
    },
    green: {
      min: minGreen,
      max: maxGreen
    },
    blue: {
      min: minBlue,
      max: maxBlue
    }
  };
}

function getVolume(colorRange: IColorRange): number {
  const { red, green, blue } = colorRange;
  return (red.max - red.min) * (green.max - green.min) * (blue.max - blue.min);
}

function getCutEdgeIdx(colorRange: IColorRange): number {
  const { red, green, blue } = colorRange;
  const edges: Array<number> = [
    red.max - red.min,
    green.max - green.min,
    blue.max - blue.min
  ];
  const maxEdge: number = Math.max(...edges);

  return edges.indexOf(maxEdge);
}

function getMedianColor(colorBox: ColorBox, cutEdgeIdx: number): number {
  const colors: Object = {};
  let colorCounts: Array<IColorCount> = [];
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

function cutBox(colorBox: ColorBox): Array<ColorBox> {
  const cutEdgeIdx: number = getCutEdgeIdx(colorBox.colorRange);
  const medianColor: number = getMedianColor(colorBox, cutEdgeIdx);
  let leftData: Array<number> = [];
  let rightData: Array<number> = [];
  let targetData: Array<number>;
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

export default function medianCut(data, count: number = 1): Array<ColorBox> {
  let colorBox: ColorBox = new ColorBox(data);
  let boxes: Array<ColorBox> = [colorBox];

  while (boxes.length < count) {
    boxes.sort((prev, next) => prev.rank - next.rank);
    colorBox = boxes.pop();
    const cutBoxes: Array<ColorBox> = cutBox(colorBox);
    boxes = boxes.concat(cutBoxes);
  }

  return boxes;
}
