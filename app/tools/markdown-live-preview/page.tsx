"use client";

import { Code2, Download, Eye, NotebookPen, RotateCcw } from "lucide-react";
import { marked } from "marked";
import { useMemo, useState } from "react";

import { DEFAULT_MARKDOWN } from "@/app/tools/markdown-live-preview/data.ts";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button.tsx";
import CopyButton from "@/components/ui/copy-button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { TextAreaField } from "@/components/ui/textarea-field.tsx";

export default function MarkdownLivePreviewPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [showHtml, setShowHtml] = useState(false);

  const renderedHtml = useMemo(() => {
    if (!markdown.trim()) return "";
    try {
      return marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
    } catch {
      return "<p>Error parsing markdown.</p>";
    }
  }, [markdown]);

  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown.split("\n").length;
    return { words, chars, lines };
  }, [markdown]);

  function handleDownloadHtml() {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }
    pre { background: #f4f4f5; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    code { font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.875em; }
    blockquote { border-left: 4px solid #d1d5db; margin: 1rem 0; padding: 0.5rem 1rem; color: #4b5563; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f4f4f5; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${renderedHtml}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadMd() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout
      icon={NotebookPen}
      title="Markdown"
      highlight="Live Preview"
      description="Write markdown with a real-time side-by-side preview. Supports GFM tables, task lists, and more."
    >
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-muted-foreground flex gap-3 text-xs">
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span>{stats.lines} lines</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/*<Button*/}
            {/*  variant="outline"*/}
            {/*  onClick={() => copy(markdown)}*/}
            {/*  disabled={!markdown}*/}
            {/*  className="rounded-full font-semibold"*/}
            {/*>*/}
            {/*  {copied ? (*/}
            {/*    <>*/}
            {/*      <Check className="text-emerald-400" />*/}
            {/*      <span className="text-emerald-400">Copied</span>*/}
            {/*    </>*/}
            {/*  ) : (*/}
            {/*    <>*/}
            {/*      <Copy />*/}
            {/*      Copy MD*/}
            {/*    </>*/}
            {/*  )}*/}
            {/*</Button>*/}

            <Button variant="outline" onClick={handleDownloadMd} disabled={!markdown}>
              <Download />
              .md
            </Button>
            <Button variant="outline" onClick={handleDownloadHtml} disabled={!renderedHtml}>
              <Download />
              .html
            </Button>
            <Button variant="outline" onClick={() => setShowHtml((v) => !v)}>
              {showHtml ? (
                <>
                  <Eye />
                  Show preview
                </>
              ) : (
                <>
                  <Code2 />
                  Show HTML
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid h-[70vh] grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          <TextAreaField
            label="Editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Start writing markdown…"
            className="h-full resize-none text-sm leading-relaxed"
            spellCheck={false}
            action={
              <ClearButton
                icon={<RotateCcw />}
                onClick={() => setMarkdown("")}
                disabled={!markdown}
              />
            }
          />

          {/* Preview / HTML */}

          {showHtml ? (
            <TextAreaField
              label="HTML Output"
              readOnly
              value={renderedHtml}
              placeholder="Generated HTML will appear here…"
              className="h-full resize-none text-sm leading-relaxed"
              spellCheck={false}
              action={<CopyButton value={renderedHtml} disabled={!renderedHtml} />}
            />
          ) : (
            <div className="flex h-full flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Preview</Label>
                <CopyButton value={markdown} disabled={!markdown} />
              </div>

              <div className="bg-card h-full rounded-lg border px-3 py-2 text-sm">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {renderedHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                  ) : (
                    <p className="text-muted-foreground">Preview will appear here…</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
