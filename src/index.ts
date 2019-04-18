import medianCut from "./medianCut";
import { getColor, getImageData } from "./helper";

interface IOptions {
  count: number;
  colorFormat: string;
  method: string;
  omitTransparentPixel: boolean;
}

const defaultOptions = {
  count: 4,
  colorFormat: "hex",
  omitTransparentPixel: true,
  method: "medianCut"
};

export default async function(
  image: string | Uint8ClampedArray | number[],
  options: IOptions = defaultOptions
) {
  if (typeof image === "string") {
    image = await getImageData(image);
  }

  options = Object.assign(defaultOptions, options);
  const { count, colorFormat, method, omitTransparentPixel } = options;
  if (omitTransparentPixel) {
    let tempImage = image;
    image = [];
    for (let i = 0; i < tempImage.length / 4; i += 1) {
      if (tempImage[i * 4 + 3]) {
        image.push(tempImage[i * 4]);
        image.push(tempImage[i * 4 + 1]);
        image.push(tempImage[i * 4 + 2]);
        image.push(tempImage[i * 4 + 3]);
      }
    }
  }

  const func = method === "medianCut" ? medianCut : () => [];
  const boxes = func(image, count);
  return boxes.slice(0, count).map(box => getColor(box.data, colorFormat));
}
