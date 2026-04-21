import { FormatOptionsMap, ResizeOptions } from "@/app/tools/image-converter/types";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      mimeType,
      quality !== undefined ? quality / 100 : undefined,
    );
  });
}

export function prepareCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  fillBackground: boolean,
  backgroundColour: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d")!;
  if (fillBackground) {
    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas;
}

export function getTargetDimensions(img: HTMLImageElement, resize: ResizeOptions) {
  if (resize.mode === "percentage") {
    const scale = resize.percentage / 100;
    return {
      width: Math.max(1, Math.round(img.naturalWidth * scale)),
      height: Math.max(1, Math.round(img.naturalHeight * scale)),
    };
  }
  if (resize.mode === "custom") {
    const w = resize.width || img.naturalWidth;
    const h = resize.height || img.naturalHeight;
    if (resize.lockAspectRatio) {
      const aspect = img.naturalWidth / img.naturalHeight;
      if (resize.width && !resize.height) return { width: w, height: Math.round(w / aspect) };
      if (resize.height && !resize.width) return { width: Math.round(h * aspect), height: h };
      if (resize.width && resize.height) return { width: w, height: Math.round(w / aspect) };
    }
    return { width: w, height: h };
  }
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export async function encodeGif(
  canvas: HTMLCanvasElement,
  options: FormatOptionsMap["gif"],
): Promise<Blob> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const palette = quantize(imageData.data, options.maxColours, { format: options.quantization });
  const index = applyPalette(imageData.data, palette, options.quantization);
  const gif = GIFEncoder();
  gif.writeFrame(index, width, height, { palette });
  gif.finish();
  return new Blob([new Uint8Array(gif.bytes())], { type: "image/gif" });
}

export async function encodeBmp(
  canvas: HTMLCanvasElement,
  options: FormatOptionsMap["bmp"],
): Promise<Blob> {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const bpp = options.bitDepth;
  const bytesPerPixel = bpp / 8;
  const rowSize = Math.ceil((width * bytesPerPixel) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const headerSize = 14 + 40;
  const fileSize = headerSize + pixelDataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d); // 'BM'
  view.setUint32(2, fileSize, true);
  view.setUint32(10, headerSize, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, -height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, bpp, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelDataSize, true);
  view.setUint32(38, 2835, true);
  view.setUint32(42, 2835, true);

  for (let y = 0; y < height; y++) {
    let off = headerSize + y * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (bpp === 32) {
        view.setUint8(off++, data[i + 2]); // B
        view.setUint8(off++, data[i + 1]); // G
        view.setUint8(off++, data[i]); // R
        view.setUint8(off++, data[i + 3]); // A
      } else {
        view.setUint8(off++, data[i + 2]);
        view.setUint8(off++, data[i + 1]);
        view.setUint8(off++, data[i]);
      }
    }
  }
  return new Blob([buffer], { type: "image/bmp" });
}

export async function encodeTiff(canvas: HTMLCanvasElement): Promise<Blob> {
  const UTIF = await import("utif");
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const arrayBuffer = UTIF.encodeImage(imageData.data, canvas.width, canvas.height);
  return new Blob([arrayBuffer], { type: "image/tiff" });
}

export async function encodeIco(
  canvas: HTMLCanvasElement,
  options: FormatOptionsMap["ico"],
): Promise<Blob> {
  const sizes = options.multiSize ? options.sizes : [options.sizes[0] || 32];
  const pngBlobs: ArrayBuffer[] = [];

  for (const size of sizes) {
    const resized = document.createElement("canvas");
    resized.width = resized.height = size;
    resized.getContext("2d")!.drawImage(canvas, 0, 0, size, size);
    pngBlobs.push(await (await canvasToBlob(resized, "image/png")).arrayBuffer());
  }

  const headerSize = 6 + sizes.length * 16;
  const totalDataSize = pngBlobs.reduce((sum, b) => sum + b.byteLength, 0);
  const buffer = new ArrayBuffer(headerSize + totalDataSize);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, sizes.length, true);

  let dataOffset = headerSize;
  for (let i = 0; i < sizes.length; i++) {
    const dirOffset = 6 + i * 16;
    const size = sizes[i];
    const pngData = pngBlobs[i];

    view.setUint8(dirOffset, size >= 256 ? 0 : size);
    view.setUint8(dirOffset + 1, size >= 256 ? 0 : size);
    view.setUint8(dirOffset + 2, 0);
    view.setUint8(dirOffset + 3, 0);
    view.setUint16(dirOffset + 4, 1, true);
    view.setUint16(dirOffset + 6, 32, true);
    view.setUint32(dirOffset + 8, pngData.byteLength, true);
    view.setUint32(dirOffset + 12, dataOffset, true);

    new Uint8Array(buffer, dataOffset, pngData.byteLength).set(new Uint8Array(pngData));
    dataOffset += pngData.byteLength;
  }
  return new Blob([buffer], { type: "image/x-icon" });
}

const ICNS_TYPE_MAP: Record<number, string> = {
  16: "icp4",
  32: "icp5",
  64: "icp6",
  128: "ic07",
  256: "ic08",
  512: "ic09",
  1024: "ic10",
};

export async function encodeIcns(
  canvas: HTMLCanvasElement,
  options: FormatOptionsMap["icns"],
): Promise<Blob> {
  const sizes = options.multiSize ? options.sizes : [options.sizes[0] || 128];
  const entries: { type: string; data: ArrayBuffer }[] = [];

  for (const size of sizes) {
    const type = ICNS_TYPE_MAP[size];
    if (!type) continue;
    const resized = document.createElement("canvas");
    resized.width = resized.height = size;
    resized.getContext("2d")!.drawImage(canvas, 0, 0, size, size);
    entries.push({ type, data: await (await canvasToBlob(resized, "image/png")).arrayBuffer() });
  }

  const totalDataSize = entries.reduce((sum, e) => sum + 8 + e.data.byteLength, 0);
  const fileSize = 8 + totalDataSize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  bytes[0] = 0x69;
  bytes[1] = 0x63;
  bytes[2] = 0x6e;
  bytes[3] = 0x73; // 'icns'
  view.setUint32(4, fileSize, false);

  let offset = 8;
  for (const entry of entries) {
    for (let i = 0; i < 4; i++) bytes[offset + i] = entry.type.charCodeAt(i);
    view.setUint32(offset + 4, 8 + entry.data.byteLength, false);
    new Uint8Array(buffer, offset + 8, entry.data.byteLength).set(new Uint8Array(entry.data));
    offset += 8 + entry.data.byteLength;
  }
  return new Blob([buffer], { type: "image/x-icns" });
}
