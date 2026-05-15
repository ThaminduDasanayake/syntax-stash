"use client";

import { marked } from "marked";
import { useMemo, useState } from "react";

import { DEFAULT_MARKDOWN } from "@/app/tools/markdown-live-preview/data";
import { Header } from "@/app/tools/markdown-live-preview/header";
import RichMarkdownEditor from "@/components/rich-markdown-editor";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

type EditorMode = "raw" | "rich";

export default function MarkdownLivePreviewPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [showHtml, setShowHtml] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("raw");

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

  const tool = internalTools.find((t) => t.slug === "markdown-live-preview");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-3">
        {/* Toolbar */}
        <Header
          stats={stats}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          showHtml={showHtml}
          setShowHtml={setShowHtml}
          markdown={markdown}
          renderedHtml={renderedHtml}
          handleDownloadMd={handleDownloadMd}
          handleDownloadHtml={handleDownloadHtml}
        />

        {/* Editor + Preview */}
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          {editorMode === "raw" ? (
            <TextAreaField
              label="Editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Start writing markdown…"
              containerClassName="flex flex-col"
              textClassName="flex-1 resize-none"
              spellCheck={false}
              action={<ClearButton onClick={() => setMarkdown("")} disabled={!markdown} />}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <Label className="pt-1.5 text-sm font-semibold">Editor</Label>
              <RichMarkdownEditor initialMarkdown={markdown} onChange={setMarkdown} />
            </div>
          )}

          {/* Preview / HTML */}
          {showHtml ? (
            <TextAreaField
              label="HTML Output"
              readOnly
              value={renderedHtml}
              placeholder="Generated HTML will appear here…"
              containerClassName="min-h-[100vh] h-full flex flex-col"
              textClassName="flex-1 resize-none text-sm"
              spellCheck={false}
              action={<CopyButton textToCopy={renderedHtml} disabled={!renderedHtml} />}
            />
          ) : (
            <div className="flex h-full flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Preview</Label>
                <CopyButton textToCopy={markdown} disabled={!markdown} />
              </div>

              <div className="bg-card h-full min-h-[70vh] rounded-lg border px-3 py-2 text-sm">
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
