"use client";

import { DownloadIcon } from "@phosphor-icons/react";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";

import {
  BACKGROUNDS,
  LANGUAGES,
  PLACEHOLDER_CODE,
  THEMES,
} from "@/app/tools/code-screenshot/constants";
import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TextAreaField } from "@/components/ui/textarea-field";
import { developmentTools } from "@/lib/tools-data";

export default function CodeScreenshotPage() {
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [background, setBackground] = useState(BACKGROUNDS[0].id);
  const [padding, setPadding] = useState(64);
  const [fontSize, setFontSize] = useState(14);
  const [showWindow, setShowWindow] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [fileName, setFileName] = useState("example.ts");
  const [highlighted, setHighlighted] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const html = await codeToHtml(code || " ", {
          lang: language,
          theme,
        });
        if (!cancelled) setHighlighted(html);
      } catch {
        if (!cancelled) setHighlighted(`<pre><code>${escapeHtml(code)}</code></pre>`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  async function handleExport() {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName.replace(/\.[^.]+$/, "") || "code"}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  }

  const activeBackgroundValue =
    BACKGROUNDS.find((bg) => bg.id === background)?.value || "transparent";

  const tool = developmentTools.find((t) => t.url === "/tools/code-screenshot");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Preview */}
        <div className="border-border overflow-auto rounded-xl border">
          <div
            ref={exportRef}
            style={{ background: activeBackgroundValue, padding: `${padding}px` }}
            className="flex min-h-70 items-center justify-center"
          >
            <div className="w-full max-w-3xl overflow-hidden rounded-xl shadow-2xl">
              {showWindow && (
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ background: "#1e1e2e" }}
                >
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="font-mono text-xs" style={{ color: "#a1a1aa" }}>
                      {fileName}
                    </span>
                  </div>
                  <div className="w-13" />
                </div>
              )}
              <div
                className="overflow-x-auto"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              >
                <ShikiRender
                  html={highlighted}
                  showLineNumbers={showLineNumbers}
                  lineCount={lineCount}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code + Controls */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-full space-y-2 lg:col-span-2">
            <TextAreaField
              label="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={20}
              className="h-full resize-none text-xs"
              spellCheck={false}
            />
          </div>

          <div className="space-y-4">
            <SelectField
              label="Language"
              options={LANGUAGES.map((lang) => ({ value: lang, label: lang }))}
              value={language}
              onValueChange={(v) => v && setLanguage(v)}
            />

            <SelectField
              label="Theme"
              options={THEMES.map((theme) => ({ value: theme.id, label: theme.label }))}
              value={theme}
              onValueChange={(v) => v && setTheme(v)}
            />

            <SelectField
              label="Background"
              options={BACKGROUNDS.map((bg) => ({ value: bg.id, label: bg.label }))}
              value={background}
              onValueChange={(v) => v && setBackground(v)}
            />

            <InputField
              label="File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              spellCheck={false}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Padding: {padding}px</Label>
                <Slider
                  value={[padding]}
                  onValueChange={(vals) => setPadding(Array.isArray(vals) ? vals[0] : vals)}
                  min={0}
                  max={128}
                  step={4}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Font: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(vals) => setFontSize(Array.isArray(vals) ? vals[0] : vals)}
                  min={10}
                  max={24}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch id="window" checked={showWindow} onCheckedChange={setShowWindow} />
                <Label htmlFor="window" className="cursor-pointer text-sm">
                  Window controls
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="line-nums"
                  checked={showLineNumbers}
                  onCheckedChange={setShowLineNumbers}
                />
                <Label htmlFor="line-nums" className="cursor-pointer text-sm">
                  Line numbers
                </Label>
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting || !highlighted}
              className="w-full gap-2 font-semibold"
            >
              <DownloadIcon weight="duotone" className="size-5" />
              {isExporting ? "Exporting…" : "Download PNG"}
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ShikiRender({
  html,
  showLineNumbers,
  lineCount,
}: {
  html: string;
  showLineNumbers: boolean;
  lineCount: number;
}) {
  if (!html) {
    return <div className="p-6 font-mono text-sm text-neutral-400">Loading…</div>;
  }

  if (!showLineNumbers) {
    return (
      <div
        className="shiki-wrap [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5!"
        style={{ background: "var(--shiki-bg, #282c34)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="flex">
      <div
        aria-hidden
        className="py-5 pr-3 pl-5 text-right font-mono text-neutral-500 select-none"
        style={{ background: "var(--shiki-bg, #282c34)" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div
        className="flex-1 [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:py-5! [&_pre]:pr-5! [&_pre]:pl-0!"
        style={{ background: "var(--shiki-bg, #282c34)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
