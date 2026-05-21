"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { ClearButton } from "@/components/ui/clear-button";
import { ColorField } from "@/components/ui/color-field";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/components/ui/slider-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

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

  const [margin, setMargin] = useState(2);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
  const [transparentBg, setTransparentBg] = useState(false);

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

        const options = {
          errorCorrectionLevel: errorLevel,
          margin: margin,
          color: {
            dark: fg,
            light: transparentBg ? "#00000000" : bg,
          },
        };

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

        QRCode.toString(text, { ...options, type: "svg" })
          .then((svg: string) => {
            if (!cancelled) setSvgString(svg);
          })
          .catch(() => {});
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

    if (isTempBlob) URL.revokeObjectURL(downloadUrl);
  }

  const tool = internalTools.find((t) => t.slug === "qr-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/*  Inputs & Options */}
        <div className="space-y-8">
          {/* Content Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <Button key={t.label} variant="outline" size="sm" onClick={() => setText(t.value)}>
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
              <SliderField
                label="Padding (Margin)"
                value={[margin]}
                showInput={true}
                onValueChange={(vals) => setMargin(vals[0])}
                min={0}
                max={10}
                suffix="px"
              />

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

              <CheckboxField
                label="Transparent background"
                checked={transparentBg}
                onCheckedChange={(checked) => setTransparentBg(checked === true)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColorField label="Foreground" value={fg} onValueChange={setFg} />
              <ColorField label="Background" value={bg} onValueChange={setBg} />
            </div>
          </div>

          {error && <ErrorAlert message={error} />}
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

              <div className="flex w-full justify-center gap-3">
                <DownloadButton
                  label="PNG"
                  onClick={() => handleDownload("png")}
                  disabled={!dataUrl}
                  className="flex-1"
                />

                <DownloadButton
                  label="SVG"
                  onClick={() => handleDownload("svg")}
                  disabled={!svgString}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
