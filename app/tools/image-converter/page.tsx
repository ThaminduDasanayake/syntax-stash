"use client";

import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ImageFormat } from "@/app/tools/image-converter/types";
import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXT_MAP: Record<ImageFormat, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileDrop(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  function handleFormatChange(v: string | null) {
    if (!v) return;
    setFormat(v as ImageFormat);
  }

  async function handleConvert() {
    if (!file || !previewUrl) return;
    setIsConverting(true);
    setError(null);

    try {
      const img = new window.Image();
      img.src = previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image."));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Canvas context unavailable.");
        setIsConverting(false);
        return;
      }

      // Fill white background before drawing for JPEG (no alpha channel)
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Conversion failed — unable to produce output blob.");
            setIsConverting(false);
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const ext = EXT_MAP[format];
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `${baseName}.${ext}`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          setIsConverting(false);
        },
        format,
        0.92,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
      setIsConverting(false);
    }
  }

  return (
    <ToolLayout
      icon={ImageIcon}
      title="Omni-Image"
      highlight="Converter"
      description="Convert images locally between WebP, JPEG and PNG without uploading to a server."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Dropzone or Preview */}
        <div className="space-y-4">
          <Label className="text-foreground">Image</Label>
          {!file ? (
            <FileDropzone
              onFileDropAction={handleFileDrop}
              accept="image/*"
              label="Drop an image here"
            />
          ) : (
            <div className="space-y-3">
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="border-border max-h-96 w-auto rounded-xl border object-contain"
                />
              )}
              <Button
                variant="ghost"
                onClick={handleClear}
                className="hover:text-foreground text-muted-foreground px-0 text-xs"
              >
                Clear image
              </Button>
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        {/* Right — Format & Convert */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground">Target Format</Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="border-foreground/30 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/webp">WebP</SelectItem>
                <SelectItem value="image/jpeg">JPEG</SelectItem>
                <SelectItem value="image/png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border px-6 py-2 font-semibold transition-all duration-200 disabled:opacity-50"
          >
            <Download size={16} className="mr-2" />
            {isConverting ? "Converting..." : "Convert & Download"}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
