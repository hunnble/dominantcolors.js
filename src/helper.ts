function toHex(count: number) {
  let hex: string = Math.round(count)
    .toString(16)
    .toUpperCase();
  return hex.padStart(2, "0");
}

export function getRGBFromData(data, idx) {
  let redData = data[idx * 4];
  let greenData = data[idx * 4 + 1];
  let blueData = data[idx * 4 + 2];
  return {
    redData,
    greenData,
    blueData
  };
}

export function getColor(data, format: string = "hex"): Object | string {
  const pixelCount = data.length / 4;
  let red: number = 0;
  let green: number = 0;
  let blue: number = 0;

  for (let i = 0; i < pixelCount; i += 1) {
    const { redData, greenData, blueData } = getRGBFromData(data, i);
    red += redData;
    green += greenData;
    blue += blueData;
  }
  red = red / pixelCount;
  green = green / pixelCount;
  blue = blue / pixelCount;

  if (format === "rgb") {
    return {
      red: Math.round(red),
      green: Math.round(green),
      blue: Math.round(blue)
    };
  }

  if (format === "hex") {
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  }
}
