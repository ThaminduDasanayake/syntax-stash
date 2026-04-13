"use client";

import { ArrowLeft, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Format = "image/webp" | "image/jpeg" | "image/png";
const EXT_MAP: Record<Format, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("image/webp");
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

  function handleReplace() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  function handleFormatChange(v: string | null) {
    if (!v) return;
    setFormat(v as Format);
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
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold tracking-tighter text-white md:text-5xl">
            Omni-Image <span className="text-orange-500">Converter</span>
          </h1>
          <p className="text-base text-zinc-400 md:text-lg">
            Convert images locally between WebP, JPEG, and PNG — never uploaded to a server.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — Dropzone or Preview */}
          <div className="space-y-4">
            <Label className="text-zinc-300">Image</Label>
            {!file ? (
              <FileDropzone
                onFileDropAction={handleFileDrop}
                accept="image/*"
                label="Drop an image here"
              />
            ) : (
              <div className="space-y-3">
                <Image
                  src={previewUrl!}
                  alt="Preview"
                  className="max-h-96 w-auto rounded-xl border border-white/10 object-contain"
                />
                <Button
                  variant="ghost"
                  onClick={handleReplace}
                  className="px-0 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Replace image
                </Button>
              </div>
            )}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {/* Right — Format & Convert */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Target Format</Label>
              <Select value={format} onValueChange={handleFormatChange}>
                <SelectTrigger className="h-10 w-full border-white/10 bg-[#0C0C0C] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0C0C0C]">
                  <SelectItem
                    value="image/webp"
                    className="text-zinc-300 focus:bg-white/5 focus:text-white"
                  >
                    WebP
                  </SelectItem>
                  <SelectItem
                    value="image/jpeg"
                    className="text-zinc-300 focus:bg-white/5 focus:text-white"
                  >
                    JPEG
                  </SelectItem>
                  <SelectItem
                    value="image/png"
                    className="text-zinc-300 focus:bg-white/5 focus:text-white"
                  >
                    PNG
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-6 py-2 font-semibold text-orange-400 transition-all duration-200 hover:bg-orange-500/20 disabled:opacity-50"
            >
              <Download size={16} className="mr-2" />
              {isConverting ? "Converting..." : "Convert & Download"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
