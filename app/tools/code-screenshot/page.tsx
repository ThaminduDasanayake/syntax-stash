"use client";

import { Download, ImageDown } from "lucide-react";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const LANGUAGES = [
  "typescript", "javascript", "tsx", "jsx", "python", "go", "rust", "java",
  "c", "cpp", "csharp", "ruby", "php", "swift", "kotlin", "bash", "html",
  "css", "scss", "json", "yaml", "toml", "sql", "markdown", "dockerfile",
  "graphql",
];

const THEMES = [
  { id: "github-dark", label: "GitHub Dark" },
  { id: "github-light", label: "GitHub Light" },
  { id: "dracula", label: "Dracula" },
  { id: "nord", label: "Nord" },
  { id: "one-dark-pro", label: "One Dark Pro" },
  { id: "min-dark", label: "Min Dark" },
  { id: "monokai", label: "Monokai" },
  { id: "vitesse-dark", label: "Vitesse Dark" },
  { id: "vitesse-light", label: "Vitesse Light" },
];

const BACKGROUNDS = [
  { id: "sunset", label: "Sunset", value: "linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #ec4899 100%)" },
  { id: "ocean", label: "Ocean", value: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)" },
  { id: "forest", label: "Forest", value: "linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #06b6d4 100%)" },
  { id: "candy", label: "Candy", value: "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #3b82f6 100%)" },
  { id: "mono", label: "Mono Dark", value: "#1f2937" },
  { id: "charcoal", label: "Charcoal", value: "#0f172a" },
  { id: "white", label: "White", value: "#ffffff" },
  { id: "transparent", label: "Transparent", value: "transparent" },
];

const PLACEHOLDER_CODE = `function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const log = debounce((msg: string) => {
  console.log("tick:", msg);
}, 300);`;

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

  return (
    <ToolLayout
      icon={ImageDown}
      title="Code"
      highlight="Screenshot"
      description="Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki."
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Preview */}
        <div className="border-border overflow-auto rounded-xl border">
          <div
            ref={exportRef}
            style={{ background, padding: `${padding}px` }}
            className="flex min-h-[280px] items-center justify-center"
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
                  <div className="w-[52px]" />
                </div>
              )}
              <div
                className="overflow-x-auto"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              >
                <ShikiRender html={highlighted} showLineNumbers={showLineNumbers} lineCount={lineCount} />
              </div>
            </div>
          </div>
        </div>

        {/* Code + Controls */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <Label>Code</Label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="resize-y font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(v) => v && setTheme(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THEMES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Background</Label>
              <Select value={background} onValueChange={(v) => v && setBackground(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BACKGROUNDS.map((b) => (
                    <SelectItem key={b.id} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filename">File name</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="padding" className="text-xs">Padding: {padding}px</Label>
                <input
                  id="padding"
                  type="range"
                  min={0}
                  max={128}
                  step={4}
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize" className="text-xs">Font: {fontSize}px</Label>
                <input
                  id="fontSize"
                  type="range"
                  min={10}
                  max={24}
                  step={1}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch id="window" checked={showWindow} onCheckedChange={setShowWindow} />
                <Label htmlFor="window" className="cursor-pointer text-sm">Window controls</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="line-nums" checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
                <Label htmlFor="line-nums" className="cursor-pointer text-sm">Line numbers</Label>
              </div>
            </div>

            <Button onClick={handleExport} disabled={isExporting || !highlighted} className="w-full">
              <Download size={14} />
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
        className="shiki-wrap [&_pre]:m-0! [&_pre]:p-5! [&_pre]:bg-transparent!"
        style={{ background: "var(--shiki-bg, #282c34)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="flex">
      <div
        aria-hidden
        className="select-none py-5 pl-5 pr-3 font-mono text-right text-neutral-500"
        style={{ background: "var(--shiki-bg, #282c34)" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div
        className="flex-1 [&_pre]:m-0! [&_pre]:py-5! [&_pre]:pr-5! [&_pre]:pl-0! [&_pre]:bg-transparent!"
        style={{ background: "var(--shiki-bg, #282c34)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
