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
  colorCount: number;
  method: string;
  omitTransparentPixel: boolean;
}

const defaultOptions = {
  colorCount: 2,
  omitTransparentPixel: true,
  method: "medianCut"
};

export default async function(
  image: string | ArrayBuffer,
  options: IOptions = defaultOptions
) {
  if (typeof image === "string") {
    image = await getImageData(image);
  }

  Object.assign(options, defaultOptions);
  const { colorCount, method } = options;
  const func = method === "medianCut" ? medianCut : () => [];

  const boxes = func(image, colorCount);
  return boxes.slice(0, colorCount).map(box => getColor(box.data));
}
