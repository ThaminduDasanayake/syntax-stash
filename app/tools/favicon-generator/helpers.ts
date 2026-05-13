import { canvasToBlob, encodeIco } from "@/app/tools/image-converter/helpers";

export const OUTPUT_SIZES = [
  { size: 16, filename: "favicon-16x16.png", label: "16×16 PNG" },
  { size: 32, filename: "favicon-32x32.png", label: "32×32 PNG" },
  { size: 48, filename: "favicon-48x48.png", label: "48×48 PNG" },
  { size: 96, filename: "favicon-96x96.png", label: "96×96 PNG" },
  { size: 180, filename: "apple-touch-icon.png", label: "180×180 (Apple Touch)" },
  { size: 192, filename: "android-chrome-192x192.png", label: "192×192 (Android)" },
  { size: 512, filename: "android-chrome-512x512.png", label: "512×512 (Android)" },
];

export interface RenderOptions {
  padding: number;
  fillBackground: boolean;
  backgroundColor: string;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function rasterizeSvgToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const srcW = img.naturalWidth || size;
  const srcH = img.naturalHeight || size;
  const scale = Math.min(size / srcW, size / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  ctx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);

  return loadImage(canvas.toDataURL("image/png"));
}

export function renderSizeToCanvas(
  source: HTMLImageElement,
  size: number,
  opts: RenderOptions,
  forceOpaque = false,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // apple-touch-icon always needs an opaque background
  const bg = forceOpaque
    ? opts.fillBackground
      ? opts.backgroundColor
      : "#ffffff"
    : opts.fillBackground
      ? opts.backgroundColor
      : null;

  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
  }

  const padPx = Math.round((size * opts.padding) / 100);
  const inner = size - padPx * 2;
  const srcW = source.naturalWidth || size;
  const srcH = source.naturalHeight || size;
  const scale = Math.min(inner / srcW, inner / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const x = padPx + (inner - drawW) / 2;
  const y = padPx + (inner - drawH) / 2;

  ctx.drawImage(source, x, y, drawW, drawH);
  return canvas;
}

export async function generateAllBlobs(
  source: HTMLImageElement,
  opts: RenderOptions,
): Promise<Map<string, Blob>> {
  const result = new Map<string, Blob>();

  for (const { size, filename } of OUTPUT_SIZES) {
    const forceOpaque = filename === "apple-touch-icon.png";
    const canvas = renderSizeToCanvas(source, size, opts, forceOpaque);
    result.set(filename, await canvasToBlob(canvas, "image/png"));
  }

  const bigCanvas = renderSizeToCanvas(source, 512, opts);
  result.set("favicon.ico", await encodeIco(bigCanvas, { sizes: [16, 32, 48], multiSize: true }));

  return result;
}

export function buildHtmlSnippet(): string {
  return `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
}

export function buildWebmanifest(name: string): string {
  return JSON.stringify(
    {
      name,
      short_name: name,
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2,
  );
}

export async function buildZip(
  blobs: Map<string, Blob>,
  manifestJson: string,
  htmlSnippet: string,
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const [name, blob] of blobs) zip.file(name, blob);
  zip.file("site.webmanifest", manifestJson);
  zip.file(
    "README.html",
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Favicon Setup</title></head><body><h2>Add to your HTML &lt;head&gt;</h2><pre>${htmlSnippet.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre></body></html>`,
  );
  return zip.generateAsync({ type: "blob" });
}
