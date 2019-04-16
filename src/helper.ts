function toHex(count: number): string {
  let hex: string = Math.round(count)
    .toString(16)
    .toUpperCase();
  return hex.padStart(2, "0");
}

export function getRGBFromData(
  data: Uint8ClampedArray | number[],
  idx: number
): {
  redData: number;
  greenData: number;
  blueData: number;
} {
  let redData = data[idx * 4];
  let greenData = data[idx * 4 + 1];
  let blueData = data[idx * 4 + 2];
  return {
    redData,
    greenData,
    blueData
  };
}

export async function getImageData(src: string): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      const { width, height } = image;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", String(width));
      canvas.setAttribute("width", String(height));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      const { data } = context.getImageData(0, 0, width, height);
      resolve(data);
    };

    image.onerror = image.onabort = () => {
      reject(new Error("Load image failed, please try again."));
    };
  });
}

export function getColor(
  data: Uint8ClampedArray | number[],
  format: string = "hex"
): Object | string {
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
