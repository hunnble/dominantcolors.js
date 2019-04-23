export interface IColorRange {
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

export interface IOptions {
  count: number;
  colorFormat: string;
}
