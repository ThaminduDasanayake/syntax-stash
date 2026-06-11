"use client";

import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";

import {
  BACKGROUNDS,
  LANGUAGES,
  PLACEHOLDER_CODE,
  THEMES,
} from "@/app/tools/code-screenshot/constants";
import { ErrorAlert } from "@/components/error-alert";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ToolLayout } from "@/components/tool-layout";
import { DownloadButton } from "@/components/ui/download-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { SwitchField } from "@/components/ui/switch-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function CodeScreenshotPage() {
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState("github-dark");
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [padding, setPadding] = useState(64);
  const [fontSize, setFontSize] = useState(14);
  const [showWindow, setShowWindow] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [fileName, setFileName] = useState("example.ts");
  const [highlighted, setHighlighted] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
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
    setExportError(null);
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
      setExportError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  const activeBackgroundValue =
    BACKGROUNDS.find((bg) => bg.value === background)?.color || "transparent";

  const tool = internalTools.find((t) => t.slug === "code-screenshot");

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
            <div className="w-full max-w-3xl overflow-hidden">
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
            <TextareaGroup label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
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
              options={THEMES}
              value={theme}
              onValueChange={(v) => v && setTheme(v)}
            />

            <SelectField
              label="Background"
              options={BACKGROUNDS}
              value={background}
              onValueChange={(v) => v && setBackground(v)}
            />

            <InputField
              label="File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              spellCheck={false}
            />

            <SliderField
              label="Padding"
              valueLabel={`${padding}px`}
              value={[padding]}
              onValueChange={(vals) => setPadding(vals[0])}
              min={0}
              max={128}
              step={4}
            />

            <SliderField
              label="Font"
              valueLabel={`${fontSize}px`}
              value={[fontSize]}
              onValueChange={(vals) => setFontSize(vals[0])}
              min={10}
              max={24}
            />

            <div className="space-y-3">
              <SwitchField
                label="Window controls"
                checked={showWindow}
                onCheckedChange={setShowWindow}
              />
              <SwitchField
                label="Line numbers"
                checked={showLineNumbers}
                onCheckedChange={setShowLineNumbers}
              />
            </div>

            {exportError && <ErrorAlert message={exportError} />}

            <DownloadButton
              onClick={handleExport}
              disabled={isExporting || !highlighted}
              label={isExporting ? "Exporting..." : "Download PNG"}
              className="w-full"
            />
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
    return (
      <div
        className="flex min-h-24 items-center justify-center p-6"
        style={{ background: "var(--shiki-bg, #282c34)" }}
      >
        <LoadingSpinner />
      </div>
    );
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
