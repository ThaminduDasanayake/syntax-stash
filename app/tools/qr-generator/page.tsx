"use client";

import { Download, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://syntax-stash.dev");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim()) {
      setTimeout(() => {
        setDataUrl(null);
        setError(null);
      }, 0);
      return;
    }
    QRCode.toDataURL(text, {
      color: { dark: fg, light: bg },
      margin: 2,
      width: 512,
    })
      .then((url) => {
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
    return () => {
      cancelled = true;
    };
  }, [text, fg, bg]);

  function handleDownload() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qr-code.png";
    a.click();
  }

  const inputClass =
    "h-10 bg-background border-border text-foreground font-mono placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30";

  return (
    <ToolLayout
      icon={QrCode}
      title="QR"
      highlight="Generator"
      description="Generate downloadable QR codes instantly — works entirely in your browser."
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground">URL or Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-32 resize-none font-mono text-sm focus-visible:ring-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Foreground</Label>
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
              <Label className="text-foreground">Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="bg-background border-border h-10 w-14 cursor-pointer rounded-md p-1"
                />
                <Input
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className={inputClass}
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-destructive font-mono text-sm">{error}</p>}
        </div>

        {/* Right — preview */}
        <div className="space-y-4">
          <Label className="text-foreground">Preview</Label>
          <Card className="flex min-h-80 items-center justify-center">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              {dataUrl ? (
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <img src={dataUrl} alt="Generated QR code" className="block h-56 w-56" />
                </div>
              ) : (
                <div className="border-border flex h-56 w-56 items-center justify-center rounded-xl border border-dashed">
                  <p className="text-muted-foreground px-4 text-center font-mono text-xs">
                    Enter text above to generate a QR code
                  </p>
                </div>
              )}
              <Button onClick={handleDownload} disabled={!dataUrl} className="w-full gap-2">
                <Download size={14} />
                Download PNG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
