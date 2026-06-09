"use client";

import {
  CircleNotchIcon,
  ImageIcon,
  LockIcon,
  LockOpenIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
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
import { ErrorAlert } from "@/components/error-alert";
import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ClearButton } from "@/components/ui/clear-button";
import { DownloadButton } from "@/components/ui/download-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";
import { SwitchField } from "@/components/ui/switch-field";
import { buildAcceptMap } from "@/lib/file-types";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

export default function ImageConverterPage() {
  const [images, setImages] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("webp");
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
  const [converting, setConverting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);
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
    const heicErrors: string[] = [];
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
          } catch {
            heicErrors.push(f.name);
            return null;
          }
        }),
      );

      const validFiles = processed.filter((f): f is File => f !== null);
      setImages((prev) => [...prev, ...validFiles]);
      setConverted([]);
      if (heicErrors.length) setFailedFiles(heicErrors);
    } finally {
      setIsReading(false);
    }
  };

  const handleDrop = useCallback((droppedFiles: File[]) => {
    const validFiles = droppedFiles.filter(
      (f) => f.type.startsWith("image/") || f.name.toLowerCase().endsWith(".heic"),
    );
    void processFiles(validFiles);
  }, []);

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
    setFailedFiles([]);
    converted.forEach((img) => URL.revokeObjectURL(img.url));
    const results: ConvertedImage[] = [];
    const errors: string[] = [];

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
      } catch {
        errors.push(file.name);
      }
    }
    setConverted(results);
    if (errors.length) setFailedFiles(errors);
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

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const formatsWithSettings = ["jpeg", "webp", "avif", "png", "ico"];

  const tool = internalTools.find((t) => t.slug === "image-converter");

  return (
    <ToolLayout tool={tool}>
      <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Dropzone & Image List */}
        <div className="w-full min-w-0 space-y-6">
          {isReading ? (
            <div className="bg-blueprint-card flex h-48 flex-col items-center justify-center gap-3 border-2 border-dashed">
              <CircleNotchIcon className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground animate-pulse text-sm font-medium">
                &gt; DECODING HEIC IMAGES...
              </p>
            </div>
          ) : (
            <FileDropzone
              multiple={true}
              onFilesDropAction={handleDrop}
              accept={buildAcceptMap([
                ".png",
                ".jpg",
                ".jpeg",
                ".webp",
                ".avif",
                ".gif",
                ".heic",
                ".heif",
              ])}
              label={
                <>
                  <p className="text-foreground text-sm font-bold tracking-wider uppercase">
                    Drop images here
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Supports PNG, JPEG, WEBP, AVIF, GIF, & HEIC
                  </p>
                </>
              }
            />
          )}

          {images.length > 0 && (
            <div className="w-full min-w-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground font-mono text-[11px] font-bold tracking-widest uppercase">
                  {"//"} {images.length} FILE{images.length !== 1 ? "S" : ""} SELECTED
                </h3>
                <ClearButton
                  icon={<TrashIcon weight="bold" />}
                  label="Clear All"
                  variant="destructive"
                  size="sm"
                  onClick={clearAll}
                />
              </div>

              {/* Scrollable File Queue Deck */}
              <div className="bg-blueprint-card grid max-h-100 min-w-0 gap-3 overflow-y-auto border-2 p-3">
                {images.map((file, i) => (
                  <div
                    key={i}
                    className="bg-card flex min-w-0 items-center gap-3 border-2 p-2 hover:shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrls[i]}
                      alt={file.name}
                      className="bg-muted size-10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                        {formatSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    >
                      <XIcon weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings & Convert */}
        <div className="w-full min-w-0 space-y-6">
          <div className="space-y-3">
            <Label className="text-muted-foreground font-mono text-[11px] font-bold tracking-widest uppercase">
              {"//"} TARGET FORMAT
            </Label>
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
                  className="text-xs font-bold uppercase"
                  size="sm"
                  disabled={fmt === "avif" && avifSupported === false}
                >
                  {fmt}
                </Button>
              ))}
            </div>
          </div>
          {formatsWithSettings.includes(targetFormat) && (
            <div className="bg-card space-y-4 border p-4">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono text-[11px] font-bold tracking-widest uppercase">
                  {"//"} {targetFormat} CONTEXT OPTIMIZATION
                </span>
                <div className="flex-1 border-t" />
              </div>

              {targetFormat === "png" && (
                <SwitchField
                  label="Preserve transparency"
                  checked={formatOptions.png.transparency}
                  onCheckedChange={(v) => updateFormatOption("png", "transparency", v)}
                />
              )}

              {(targetFormat === "jpeg" || targetFormat === "webp" || targetFormat === "avif") && (
                <SliderField
                  label="Quality"
                  valueLabel={`${currentQuality}%`}
                  value={[currentQuality]}
                  onValueChange={(vals) => {
                    updateFormatOption(
                      targetFormat as "jpeg" | "webp" | "avif",
                      "quality",
                      vals[0],
                    );
                  }}
                  min={1}
                  max={100}
                />
              )}

              {targetFormat === "ico" && (
                <SwitchField
                  label="Embed multi-size"
                  checked={formatOptions.ico.multiSize}
                  onCheckedChange={(v) => updateFormatOption("ico", "multiSize", v)}
                />
              )}
            </div>
          )}
          {/* Resize Settings */}
          <div className="bg-card space-y-4 border p-4">
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono text-[11px] font-bold tracking-widest uppercase">
                {"//"} RESIZING
              </span>
              <div className="flex-1 border-t" />
            </div>
            <ButtonGroup className="grid w-full grid-cols-3">
              {(
                [
                  { v: "original", l: "Original" },
                  { v: "custom", l: "Dimensions" },
                  { v: "percentage", l: "Scale" },
                ] as const
              ).map((mode) => (
                <Button
                  key={mode.v}
                  onClick={() => setResize((p) => ({ ...p, mode: mode.v }))}
                  variant={resize.mode === mode.v ? "default" : "outline"}
                  className="w-full"
                >
                  {mode.l}
                </Button>
              ))}
            </ButtonGroup>
            {resize.mode === "custom" && (
              <div className="flex items-center gap-3">
                <InputField
                  label="Width"
                  type="number"
                  placeholder="Auto"
                  value={resize.width || ""}
                  onChange={(e) => setResize((p) => ({ ...p, width: Number(e.target.value) }))}
                />
                <Button
                  onClick={() => setResize((p) => ({ ...p, lockAspectRatio: !p.lockAspectRatio }))}
                  size="icon"
                  variant={resize.lockAspectRatio ? "default" : "outline"}
                  className={cn(
                    resize.lockAspectRatio && "bg-primary/10 text-primary border-primary",
                    "mt-5",
                  )}
                >
                  {resize.lockAspectRatio ? (
                    <LockIcon weight="duotone" />
                  ) : (
                    <LockOpenIcon weight="duotone" />
                  )}
                </Button>
                <InputField
                  label="Height"
                  type="number"
                  placeholder="Auto"
                  value={resize.height || ""}
                  onChange={(e) => setResize((p) => ({ ...p, height: Number(e.target.value) }))}
                />
              </div>
            )}
          </div>
          {failedFiles.length > 0 && (
            <ErrorAlert message={`Failed to process: ${failedFiles.join(", ")}`} />
          )}
          <Button
            className="w-full font-semibold"
            onClick={convertImages}
            disabled={converting || images.length === 0}
          >
            {converting ? (
              <CircleNotchIcon className="mr-2 size-5 animate-spin" />
            ) : (
              <ImageIcon weight="duotone" className="mr-2 size-5" />
            )}
            {converting
              ? "Processing..."
              : images.length === 0
                ? "Convert Images"
                : `Convert ${images.length} Image${images.length === 1 ? "" : "s"}`}
          </Button>
          {/* Converted Results */}

          {converted.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-primary font-mono text-[11px] font-bold tracking-widest uppercase">
                  {"//"} Converted Files
                </h3>
                {converted.length > 1 && (
                  <DownloadButton
                    label="Download ZIP"
                    variant="outline"
                    onClick={downloadAllAsZip}
                  />
                )}
              </div>
              <div className="grid gap-3">
                {converted.map((img, i) => (
                  <div
                    key={i}
                    className="bg-card flex items-center justify-between border p-3 hover:shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex flex-col">
                        <span className="truncate text-sm font-medium">{img.name}</span>
                        <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                          {formatSize(img.size)}
                        </span>
                      </div>
                    </div>
                    <DownloadButton
                      iconOnly
                      variant="outline"
                      onClick={() => handleDownload(img.url, img.name)}
                    />
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
