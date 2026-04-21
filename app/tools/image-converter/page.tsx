"use client";

import { Archive, Download, ImageIcon, Loader2, Lock, Unlock, Upload, X } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  canvasToBlob,
  encodeBmp,
  encodeGif,
  encodeIcns,
  encodeIco,
  encodeTiff,
  getTargetDimensions,
  prepareCanvas,
} from "@/app/tools/image-converter/helpers";
import {
  ConvertedImage,
  FormatOptionsMap,
  ImageFormat,
  ResizeOptions,
} from "@/app/tools/image-converter/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function ImageConverterPage() {
  const [images, setImages] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("webp");
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
  const [converting, setConverting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);

  const [resize, setResize] = useState<ResizeOptions>({
    mode: "original",
    width: 0,
    height: 0,
    percentage: 100,
    lockAspectRatio: true,
  });

  const [formatOptions, setFormatOptions] = useState<FormatOptionsMap>({
    png: { transparency: true, backgroundColour: "#ffffff" },
    jpeg: { quality: 90, backgroundColour: "#ffffff" },
    webp: { quality: 90, lossless: false },
    avif: { quality: 80 },
    gif: { maxColours: 256, quantization: "rgb565" },
    bmp: { bitDepth: 32 },
    tiff: {},
    ico: { sizes: [32], multiSize: false },
    icns: { sizes: [128], multiSize: false },
  });

  const previewUrls = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    setAvifSupported(canvas.toDataURL("image/avif").startsWith("data:image/avif"));
  }, []);

  // HEIC Interception & File Processing
  const processFiles = async (files: File[]) => {
    setIsReading(true);
    try {
      const processed = await Promise.all(
        files.map(async (f) => {
          const isHeic = f.name.toLowerCase().endsWith(".heic") || f.type === "image/heic";
          if (!isHeic) return f;

          try {
            const heic2any = (await import("heic2any")).default;
            const convertedBlob = await heic2any({ blob: f, toType: "image/jpeg", quality: 0.9 });
            const validBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            return new File([validBlob], f.name.replace(/\.heic$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch (e) {
            console.error("Failed to decode HEIC:", e);
            return null; // Skip corrupted files
          }
        }),
      );

      const validFiles = processed.filter((f): f is File => f !== null);
      setImages((prev) => [...prev, ...validFiles]);
      setConverted([]);
    } finally {
      setIsReading(false);
    }
  };

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.name.toLowerCase().endsWith(".heic"),
    );
    void processFiles(files);
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (f) => f.type.startsWith("image/") || f.name.toLowerCase().endsWith(".heic"),
      );
      // Fixed ignored promise
      void processFiles(files);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearAll = () => {
    converted.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setConverted([]);
  };

  // Conversion Engine
  const convertImages = async () => {
    setConverting(true);
    converted.forEach((img) => URL.revokeObjectURL(img.url));
    const results: ConvertedImage[] = [];

    for (const file of images) {
      try {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });

        const { width, height } = getTargetDimensions(img, resize);

        const needsBackground =
          targetFormat === "jpeg" ||
          (targetFormat === "png" && !formatOptions.png.transparency) ||
          (targetFormat === "bmp" && formatOptions.bmp.bitDepth === 24);

        const bgColour =
          targetFormat === "jpeg"
            ? formatOptions.jpeg.backgroundColour
            : formatOptions.png.backgroundColour;
        const canvas = prepareCanvas(img, width, height, needsBackground, bgColour);

        let blob: Blob;
        switch (targetFormat) {
          case "png":
            blob = await canvasToBlob(canvas, "image/png");
            break;
          case "jpeg":
            blob = await canvasToBlob(canvas, "image/jpeg", formatOptions.jpeg.quality);
            break;
          case "webp":
            blob = await canvasToBlob(
              canvas,
              "image/webp",
              formatOptions.webp.lossless ? 100 : formatOptions.webp.quality,
            );
            break;
          case "avif":
            blob = await canvasToBlob(canvas, "image/avif", formatOptions.avif.quality);
            break;
          case "gif":
            blob = await encodeGif(canvas, formatOptions.gif);
            break;
          case "bmp":
            blob = await encodeBmp(canvas, formatOptions.bmp);
            break;
          case "tiff":
            blob = await encodeTiff(canvas);
            break;
          case "ico":
            blob = await encodeIco(canvas, formatOptions.ico);
            break;
          case "icns":
            blob = await encodeIcns(canvas, formatOptions.icns);
            break;
        }

        const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
        results.push({
          name: file.name.replace(/\.[^.]+$/, `.${ext}`),
          originalFormat: file.type.split("/")[1] || "unknown",
          targetFormat,
          blob,
          size: blob.size,
          url: URL.createObjectURL(blob),
        });
        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error(`Failed to convert ${file.name}:`, err);
      }
    }
    setConverted(results);
    setConverting(false);
  };

  // Downloads
  const downloadAllAsZip = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const img of converted) zip.file(img.name, img.blob);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = "converted-images.zip";
    link.href = URL.createObjectURL(zipBlob);
    link.click();
  };

  const updateFormatOption = <F extends ImageFormat, K extends keyof FormatOptionsMap[F]>(
    format: F,
    key: K,
    value: FormatOptionsMap[F][K],
  ) => {
    setFormatOptions((prev) => ({ ...prev, [format]: { ...prev[format], [key]: value } }));
  };

  const currentQuality =
    targetFormat === "jpeg"
      ? formatOptions.jpeg.quality
      : targetFormat === "webp"
        ? formatOptions.webp.quality
        : targetFormat === "avif"
          ? formatOptions.avif.quality
          : 90;

  return (
    <ToolLayout
      icon={ImageIcon}
      title="Image"
      highlight="Converter"
      description="Batch convert, resize, and process images natively in your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Dropzone & Image List */}
        <div className="space-y-6">
          {isReading ? (
            <div className="border-border bg-muted/30 flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <p className="text-muted-foreground animate-pulse text-sm font-medium">
                Decoding HEIC images...
              </p>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-border bg-muted/10 hover:bg-muted/30 flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*,.heic,.heif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="text-muted-foreground mb-4 size-10" />
              <p className="text-foreground font-medium">Drop images here</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Supports PNG, JPEG, WEBP, AVIF, GIF, & HEIC
              </p>
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {images.length} file{images.length !== 1 ? "s" : ""} selected
                </h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
              <div className="grid max-h-100 gap-2 overflow-y-auto pr-2">
                {images.map((file, i) => (
                  <div
                    key={i}
                    className="bg-card border-border flex items-center gap-3 rounded-lg border p-2 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrls[i]}
                      alt={file.name}
                      className="bg-muted size-10 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-muted-foreground text-xs">{formatSize(file.size)}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings & Convert */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="font-bold">Target Format</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "png",
                  "jpeg",
                  "webp",
                  "avif",
                  "gif",
                  "bmp",
                  "tiff",
                  "ico",
                  "icns",
                ] as ImageFormat[]
              ).map((fmt) => (
                <Button
                  key={fmt}
                  variant={targetFormat === fmt ? "default" : "outline"}
                  onClick={() => setTargetFormat(fmt)}
                  className="font-bold uppercase"
                  size="sm"
                  disabled={fmt === "avif" && avifSupported === false}
                >
                  {fmt}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card border-border space-y-4 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {targetFormat} Settings
              </span>
              <div className="bg-border h-px flex-1" />
            </div>

            {targetFormat === "png" && (
              <div className="flex items-center justify-between">
                <Label className="text-sm">Preserve transparency</Label>
                <Switch
                  checked={formatOptions.png.transparency}
                  onCheckedChange={(v) => updateFormatOption("png", "transparency", v)}
                />
              </div>
            )}

            {(targetFormat === "jpeg" || targetFormat === "webp" || targetFormat === "avif") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Quality</Label>
                  <span className="text-muted-foreground font-mono text-sm">{currentQuality}%</span>
                </div>
                <Slider
                  value={[currentQuality]}
                  onValueChange={(vals) => {
                    const val = Array.isArray(vals) ? vals[0] : (vals as number);
                    updateFormatOption(targetFormat as "jpeg" | "webp" | "avif", "quality", val);
                  }}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>
            )}

            {targetFormat === "ico" && (
              <div className="flex items-center justify-between">
                <Label className="text-sm">Embed multi-size</Label>
                <Switch
                  checked={formatOptions.ico.multiSize}
                  onCheckedChange={(v) => updateFormatOption("ico", "multiSize", v)}
                />
              </div>
            )}
          </div>

          {/* Resize Settings */}
          <div className="bg-card border-border space-y-4 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Resizing
              </span>
              <div className="bg-border h-px flex-1" />
            </div>

            <div className="flex overflow-hidden rounded-lg border">
              {(
                [
                  { v: "original", l: "Original" },
                  { v: "custom", l: "Dimensions" },
                  { v: "percentage", l: "Scale" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.v}
                  onClick={() => setResize((p) => ({ ...p, mode: mode.v }))}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer ${resize.mode === mode.v ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  {mode.l}
                </button>
              ))}
            </div>

            {resize.mode === "custom" && (
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Width</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={resize.width || ""}
                    onChange={(e) => setResize((p) => ({ ...p, width: Number(e.target.value) }))}
                  />
                </div>
                <button
                  onClick={() => setResize((p) => ({ ...p, lockAspectRatio: !p.lockAspectRatio }))}
                  className={`mt-5 rounded-lg border p-2 ${resize.lockAspectRatio ? "bg-primary/10 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  {resize.lockAspectRatio ? (
                    <Lock className="size-4" />
                  ) : (
                    <Unlock className="size-4" />
                  )}
                </button>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Height</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={resize.height || ""}
                    onChange={(e) => setResize((p) => ({ ...p, height: Number(e.target.value) }))}
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="w-full font-bold"
            onClick={convertImages}
            disabled={converting || images.length === 0}
          >
            {converting ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 size-5" />
            )}
            {converting
              ? "Processing..."
              : images.length === 0
                ? "Convert Images"
                : `Convert ${images.length} Image${images.length === 1 ? "" : "s"}`}
          </Button>

          {/* Converted Results */}
          {converted.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Converted Files</h3>
                {converted.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllAsZip}
                    className="h-8 text-xs"
                  >
                    <Archive className="mr-2 size-3" /> Download ZIP
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                {converted.map((img, i) => (
                  <div
                    key={i}
                    className="bg-card border-border flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex flex-col">
                        <span className="truncate text-sm font-medium">{img.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatSize(img.size)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = img.url;
                        a.download = img.name;
                        a.click();
                      }}
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
