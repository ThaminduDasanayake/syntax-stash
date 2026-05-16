"use client";

import { XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { imageToAscii } from "@/app/tools/ascii-studio/helpers";
import FileDropzone from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";
import { buildAcceptMap } from "@/lib/file-types";

export function ImageToAsciiTab() {
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState(80);
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = resolution;
        // 0.45 corrects for character aspect ratio (chars are taller than wide)
        const h = Math.round(resolution * (img.height / img.width) * 0.45);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        setOutput(imageToAscii(data));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [file, resolution]);

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload zone & preview */}
      {file ? (
        <div className="border-border bg-muted/10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="preview"
              className="max-h-32 max-w-xs rounded-lg object-contain"
            />
          )}
          <span className="text-muted-foreground text-sm">{file.name}</span>

          <Button variant="destructive" size="sm" onClick={() => setFile(null)} className="mt-2">
            <XIcon weight="bold" />
            Clear image
          </Button>
        </div>
      ) : (
        <FileDropzone
          onFileDropAction={setFile}
          accept={buildAcceptMap([".png", ".jpg", ".jpeg", ".webp"])}
          label={
            <>
              <p className="text-foreground font-medium">Drop an image here</p>
              <p className="text-muted-foreground mt-1 text-xs">Supports PNG, JPG, JPEG, & WebP</p>
            </>
          }
        />
      )}

      {/* Resolution slider */}
      <SliderField
        label="Resolution"
        valueLabel={`${resolution} chars`}
        leftLabel="Low detail"
        rightLabel="High detail"
        value={[resolution]}
        onValueChange={(vals) => setResolution(vals[0])}
        min={40}
        max={200}
        step={5}
      />

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>ASCII Output</Label>
            <CopyButton textToCopy={output} />
          </div>
          <div className="bg-muted/30 border-border overflow-auto rounded-xl border p-4">
            <pre className="text-foreground font-mono text-[5px] leading-[5.5px] whitespace-pre select-all">
              {output}
            </pre>
          </div>
        </div>
      )}

      {!output && (
        <p className="text-muted-foreground text-center text-sm">
          Upload an image to see the ASCII conversion.
        </p>
      )}
    </div>
  );
}
