"use client";

import { Download, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// Quick templates to pre-fill the text area
const TEMPLATES = [
  { label: "URL", value: "https://" },
  { label: "Email", value: "mailto:someone@example.com?subject=Hello" },
  { label: "WiFi", value: "WIFI:T:WPA;S:MyNetworkName;P:MyPassword;;" },
  { label: "Geo", value: "geo:40.7128,-74.0060" },
];

export default function QRGeneratorPage() {
  const [text, setText] = useState("");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  // New Phase 1 States
  const [margin, setMargin] = useState(2);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
  const [transparentBg, setTransparentBg] = useState(false);

  // Output States
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null); // Phase 2
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim()) {
      setTimeout(() => {
        setDataUrl(null);
        setSvgString(null);
        setError(null);
      }, 0);
      return;
    }

    import("qrcode")
      .then((QRCodeModule) => {
        if (cancelled) return;

        const QRCode = QRCodeModule.default || QRCodeModule;

        // Shared options for both PNG and SVG
        const options = {
          errorCorrectionLevel: errorLevel,
          margin: margin,
          color: {
            dark: fg,
            // qrcode uses 8-digit hex for alpha. #00000000 is fully transparent.
            light: transparentBg ? "#00000000" : bg,
          },
        };

        // 1. Generate PNG Data URL for the preview
        QRCode.toDataURL(text, { ...options, width: 512 })
          .then((url: string) => {
            if (!cancelled) {
              setDataUrl(url);
              setError(null);
            }
          })
          .catch((e: Error) => {
            if (!cancelled) {
              setError(e.message);
              setDataUrl(null);
            }
          });

        // 2. Generate Raw SVG string for Phase 2 downloading
        QRCode.toString(text, { ...options, type: "svg" })
          .then((svg: string) => {
            if (!cancelled) setSvgString(svg);
          })
          .catch(() => {
            // Silently fail SVG generation if needed, PNG is priority
          });
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load QR generator module.");
      });

    return () => {
      cancelled = true;
    };
  }, [text, fg, bg, margin, errorLevel, transparentBg]);

  function handleDownload(format: "png" | "svg") {
    let downloadUrl: string | null = null;
    let isTempBlob = false;

    if (format === "png" && dataUrl) {
      downloadUrl = dataUrl;
    } else if (format === "svg" && svgString) {
      // Safely convert raw SVG markup into a downloadable browser URL
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      downloadUrl = URL.createObjectURL(blob);
      isTempBlob = true;
    }

    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `qr-code.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up memory if we created a Blob
    if (isTempBlob) URL.revokeObjectURL(downloadUrl);
  }

  const inputClass =
    "h-10 bg-background border-border text-foreground font-mono placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30";

  return (
    <ToolLayout
      icon={QrCode}
      title="QR"
      highlight="Generator"
      description="Generate downloadable QR codes instantly — works entirely in your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs & Options */}
        <div className="space-y-8">
          {/* Content Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <Button key={t.label} variant="outline" size="xs" onClick={() => setText(t.value)}>
                  {t.label}
                </Button>
              ))}
            </div>

            <TextAreaField
              label="Content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              rows={6}
              action={<ClearButton onClick={() => setText("")} disabled={!text} />}
            />
          </div>

          {/* Options Section */}
          <div className="bg-card border-border space-y-6 rounded-xl border p-5">
            <h3 className="text-sm font-semibold">Options</h3>

            <div className="space-y-4">
              {/* Padding Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label>Padding (Margin)</Label>
                  <span className="text-muted-foreground font-mono text-xs">{margin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="accent-primary w-full"
                />
              </div>

              {/* Error Correction */}
              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <div className="flex gap-2">
                  {(["L", "M", "Q", "H"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={errorLevel === level ? "default" : "outline"}
                      onClick={() => setErrorLevel(level)}
                      className="h-8 w-12 font-mono text-xs"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="bg-card border-border space-y-6 rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Colours</h3>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="border-border accent-primary h-4 w-4 rounded"
                />
                <span className="text-muted-foreground text-xs">Transparent background</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Foreground</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="bg-background border-border h-10 w-14 cursor-pointer rounded-md p-1"
                  />
                  <Input
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className={inputClass}
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    disabled={transparentBg}
                    className={`bg-background border-border h-10 w-14 cursor-pointer rounded-md p-1 ${transparentBg ? "opacity-50" : ""}`}
                  />
                  <Input
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    disabled={transparentBg}
                    className={`${inputClass} ${transparentBg ? "opacity-50" : ""}`}
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-destructive font-mono text-sm">{error}</p>}
        </div>

        {/* Right — Preview */}
        <div className="space-y-4">
          <Label className="text-foreground">Preview</Label>
          <Card className="flex min-h-80 items-center justify-center">
            <CardContent className="flex w-full flex-col items-center gap-6 p-6">
              {dataUrl ? (
                <div
                  className={`${transparentBg ? "[background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3PwkCKYdRAxgw0fCBMdDSEg08BAF8eEQG6B/uYAAAAAElFTkSuQmCC)]" : "bg-white"} overflow-hidden rounded shadow-sm`}
                >
                  <Image
                    src={dataUrl}
                    alt="Generated QR code"
                    width={224}
                    height={224}
                    className="block h-64 w-64"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="border-border flex h-64 w-64 items-center justify-center rounded-xl border border-dashed">
                  <p className="text-muted-foreground px-4 text-center font-mono text-xs">
                    Enter text to generate a QR code
                  </p>
                </div>
              )}

              <div className="flex w-full gap-3">
                <Button
                  onClick={() => handleDownload("png")}
                  disabled={!dataUrl}
                  className="flex-1 gap-2"
                >
                  <Download size={14} />
                  PNG
                </Button>
                <Button
                  onClick={() => handleDownload("svg")}
                  disabled={!svgString}
                  variant="secondary"
                  className="border-border flex-1 gap-2 border"
                >
                  <Download size={14} />
                  SVG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
