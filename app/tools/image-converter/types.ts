export type ImageFormat =
  | "png"
  | "jpeg"
  | "webp"
  | "avif"
  | "gif"
  | "bmp"
  | "tiff"
  | "ico"
  | "icns";
export type ResizeMode = "original" | "custom" | "percentage";

export interface ResizeOptions {
  mode: ResizeMode;
  width: number;
  height: number;
  percentage: number;
  lockAspectRatio: boolean;
}

export interface FormatOptionsMap {
  png: { transparency: boolean; backgroundColour: string };
  jpeg: { quality: number; backgroundColour: string };
  webp: { quality: number; lossless: boolean };
  avif: { quality: number };
  gif: { maxColours: number; quantization: "rgb565" | "rgb444" | "rgba4444" };
  bmp: { bitDepth: 24 | 32 };
  tiff: Record<string, never>; // empty object
  ico: { sizes: number[]; multiSize: boolean };
  icns: { sizes: number[]; multiSize: boolean };
}

export interface ConvertedImage {
  name: string;
  originalFormat: string;
  targetFormat: ImageFormat;
  blob: Blob;
  size: number;
  url: string;
}
