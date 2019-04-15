import medianCut, { ColorBox } from "./medianCut";
import { getColor } from "./helper";

async function getImageData(src: string): Promise<Uint8ClampedArray> {
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
  image: string | Uint8ClampedArray | Array<number>,
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
