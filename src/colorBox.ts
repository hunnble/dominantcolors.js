import { IColorRange } from "./interfaces";
import { getRGBFromData } from "./helper";

const MIN_COLOR = 0;
const MAX_COLOR = 255;

export class ColorBox {
  public data;
  public rank: number;
  public colorRange: IColorRange;
  public total: number;
  private getColorRange: Function = getColorRange;
  public getVolume: Function = getVolume;

  constructor(data: Uint8ClampedArray | number[]) {
    this.data = data;
    this.total = data.length / 4;
    this.colorRange = this.getColorRange(data);
    this.rank = this.getVolume(this.colorRange) * this.total;
  }
}

function getColorRange(data: Uint8ClampedArray | number[]): IColorRange {
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
