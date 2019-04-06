import { getRGBFromData } from "./helper";

const MIN_COLOR = 0;
const MAX_COLOR = 255;

function getColorRange(data) {
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
    red: [minRed, maxRed],
    green: [minGreen, maxGreen],
    blue: [minBlue, maxBlue]
  };
}

function getCutSide() {}

export default function medianCut(colors, count: number = 1) {}
