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

class ColorBox {
  private total: number;
  private data;
  private colorRange: IColorRange;
  private getColorRange: Function = getColorRange;

  constructor(data) {
    this.data = data;
    this.total = data.length / 4;
    this.colorRange = this.getColorRange(data);
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

function getVolume(colorRange: IColorRange) {
  const { red, green, blue } = colorRange;
  return (red.max - red.min) * (green.max - green.min) * (blue.max - blue.min);
}

function getCutSide() {}

export default function medianCut(boxes, count: number = 1) {
  while (boxes.length < count) {}
}
