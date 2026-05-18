"use client";

import { CSSProperties, useRef, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import FileDropzone from "@/components/file-dropzone";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ToolLayout } from "@/components/tool-layout";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { ClearButton } from "@/components/ui/clear-button";
import { ColorField } from "@/components/ui/color-field";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { buildAcceptMap } from "@/lib/file-types";
import { internalTools } from "@/lib/tools-data";

import {
  buildHtmlSnippet,
  buildWebmanifest,
  buildZip,
  generateAllBlobs,
  loadImage,
  OUTPUT_SIZES,
  rasterizeSvgToImage,
  RenderOptions,
} from "./helpers";

const HTML_SNIPPET = buildHtmlSnippet();

const CHECKERBOARD: CSSProperties = {
  background: "repeating-conic-gradient(#404040 0% 25%, #1a1a1a 0% 50%) 0 0 / 8px 8px",
};

type OutputEntry = { blob: Blob; url: string };

export default function FaviconGeneratorPage() {
  const tool = internalTools.find((t) => t.slug === "favicon-generator");

  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [outputs, setOutputs] = useState<Map<string, OutputEntry>>(new Map());
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [appName, setAppName] = useState("My App");
  const [opts, setOpts] = useState<RenderOptions>({
    padding: 0,
    fillBackground: false,
    backgroundColor: "#ffffff",
  });

  const genRef = useRef(0);

  const generate = async (img: HTMLImageElement, currentOpts: RenderOptions) => {
    const id = ++genRef.current;
    setGenerating(true);
    setGenError(null);
    try {
      const blobs = await generateAllBlobs(img, currentOpts);
      if (genRef.current !== id) return;
      setOutputs((prev) => {
        prev.forEach(({ url }) => URL.revokeObjectURL(url));
        return new Map(
          [...blobs].map(([k, blob]) => [k, { blob, url: URL.createObjectURL(blob) }]),
        );
      });
    } catch (e) {
      if (genRef.current === id)
        setGenError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      if (genRef.current === id) setGenerating(false);
    }
  };

  const handleFile = async (file: File) => {
    setOutputs((prev) => {
      prev.forEach(({ url }) => URL.revokeObjectURL(url));
      return new Map();
    });

    const img =
      file.type === "image/svg+xml"
        ? await rasterizeSvgToImage(file)
        : await (async () => {
            const url = URL.createObjectURL(file);
            const loaded = await loadImage(url);
            URL.revokeObjectURL(url);
            return loaded;
          })();

    setSourceImg(img);
    await generate(img, opts);
  };

  const applyOpts = (newOpts: RenderOptions) => {
    setOpts(newOpts);
    if (sourceImg) void generate(sourceImg, newOpts);
  };

  const downloadFile = (filename: string) => {
    const entry = outputs.get(filename);
    if (!entry) return;
    const a = document.createElement("a");
    a.download = filename;
    a.href = entry.url;
    a.click();
  };

  const downloadAll = async () => {
    const blobMap = new Map([...outputs].map(([k, v]) => [k, v.blob]));
    const zipBlob = await buildZip(blobMap, buildWebmanifest(appName), HTML_SNIPPET);
    const a = document.createElement("a");
    a.download = "favicons.zip";
    a.href = URL.createObjectURL(zipBlob);
    a.click();
  };

  const reset = () => {
    genRef.current++;
    setGenerating(false);
    setOutputs((prev) => {
      prev.forEach(({ url }) => URL.revokeObjectURL(url));
      return new Map();
    });
    setSourceImg(null);
    setOpts({ padding: 0, fillBackground: false, backgroundColor: "#ffffff" });
    setAppName("My App");
  };

  const hasOutputs = outputs.size > 0;
  const manifestJson = buildWebmanifest(appName);

  const allCards = [
    ...OUTPUT_SIZES,
    { size: 32, filename: "favicon.ico", label: "favicon.ico (16/32/48)" },
  ];

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        <FileDropzone
          onFileDropAction={handleFile}
          accept={buildAcceptMap([".png", ".jpg", ".jpeg", ".svg", ".webp"])}
          label={
            <>
              <p className="text-foreground font-medium">
                Drop an image here (Square sources work best)
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Supports PNG, SVG, JPG, or WebP</p>
            </>
          }
        />

        {sourceImg && (
          <>
            <div className="flex flex-wrap items-end gap-4">
              <InputField
                label="Padding %"
                type="number"
                min={0}
                max={25}
                value={opts.padding}
                onChange={(e) =>
                  applyOpts({
                    ...opts,
                    padding: Math.min(25, Math.max(0, Number(e.target.value))),
                  })
                }
                inputClassName="w-20"
              />
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex items-center gap-2">
                  <CheckboxField
                    label="Fill"
                    checked={opts.fillBackground}
                    onCheckedChange={(checked) =>
                      applyOpts({ ...opts, fillBackground: checked === true })
                    }
                  />

                  <ColorField
                    value={opts.backgroundColor}
                    onValueChange={(val) => applyOpts({ ...opts, backgroundColor: val })}
                  />
                </div>
              </div>
              <InputField
                label="App name (manifest)"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                inputClassName="w-48"
              />
              <ClearButton onClick={reset} />
            </div>

            {generating && <LoadingSpinner label="Generating..." />}
            {genError && <ErrorAlert message={genError} />}

            {hasOutputs && (
              <div>
                <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                  Preview &amp; Download
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                  {allCards.map(({ size, filename, label }) => {
                    const entry = outputs.get(filename);
                    const displaySize = Math.min(size, 64);
                    return (
                      <div
                        key={filename}
                        className="border-border flex flex-col items-center gap-2 rounded-lg border p-3 text-center"
                      >
                        <div
                          className="flex items-center justify-center rounded"
                          style={{ width: 64, height: 64, ...CHECKERBOARD }}
                        >
                          {entry && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={entry.url}
                              alt={label}
                              width={displaySize}
                              height={displaySize}
                              style={{ imageRendering: size <= 48 ? "pixelated" : "auto" }}
                            />
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs leading-tight">{label}</span>
                        <DownloadButton
                          label="Save"
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => downloadFile(filename)}
                          disabled={!entry}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasOutputs && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HTML &lt;head&gt; tags</span>
                    <CopyButton textToCopy={HTML_SNIPPET} />
                  </div>
                  <pre className="border-border bg-muted overflow-x-auto rounded-lg border p-4 text-xs">
                    {HTML_SNIPPET}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">site.webmanifest</span>
                    <CopyButton textToCopy={manifestJson} />
                  </div>
                  <pre className="border-border bg-muted overflow-x-auto rounded-lg border p-4 text-xs">
                    {manifestJson}
                  </pre>
                </div>
              </div>
            )}

            {hasOutputs && (
              <div className="flex justify-center">
                <DownloadButton label="Download all (ZIP)" onClick={downloadAll} />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
