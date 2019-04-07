import { getRGBFromData, getColor } from "./helper";

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

class ColorBox {
  public data;
  public rank: number;
  public colorRange: IColorRange;
  public total: number;
  private getColorRange: Function = getColorRange;
  private getVolume: Function = getVolume;

  constructor(data) {
    this.data = data;
    this.total = data.length / 4;
    this.colorRange = this.getColorRange(data);
    this.rank = this.getVolume(this.colorRange) * this.total;
  }
}

function getColorRange(data): IColorRange {
  const pixelCount = data.length / 4;
  let minRed: number = MIN_COLOR;
  let maxRed: number = MAX_COLOR;
  let minGreen: number = MIN_COLOR;
  let maxGreen: number = MAX_COLOR;
  let minBlue: number = MIN_COLOR;
  let maxBlue: number = MAX_COLOR;

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

function getMedianColor(colorBox: ColorBox, cutEdgeIdx: number): IColorCount {
  const colors: Object = {};
  let colorCounts: Array<IColorCount> = [];
  let color: number;

  for (let i = 0; i < colorBox.total; i += 1) {
    color = colorBox.data[i * 4 + cutEdgeIdx];
    if (!colors[color]) {
      colors[color] = 1;
    } else {
      colors[color] += 1;
    }
  }
  for (const key in colors) {
    colorCounts.push({
      color: parseInt(key, 10),
      count: colorCounts[key]
    });
  }
  colorCounts.sort((prev, next) => prev.count - next.count);
  const medianIdx = Math.floor(colorCounts.length / 2);
  let count = 0;
  for (let i = 0; i <= medianIdx; i += 1) {
    count += colorCounts[i].count;
  }
  return {
    color: colorCounts[medianIdx].color,
    count
  };
}

function cutBox(colorBox: ColorBox) {
  const cutEdgeIdx: number = getCutEdgeIdx(colorBox.colorRange);
  const {
    color: medianColor,
    count: medianCount
  }: IColorCount = getMedianColor(colorBox, cutEdgeIdx);
}

export default function medianCut(data, count: number = 1) {
  const colorBox = new ColorBox(data);
  let boxes = [colorBox];

  while (boxes.length < count) {
    boxes.sort((prev, next) => prev.rank - next.rank);
    const colorBox = boxes.pop();
    var cutBoxes = cutBox(colorBox);
    boxes = boxes.concat(cutBoxes);
  }
  return getColor(colorBox.data);
}
