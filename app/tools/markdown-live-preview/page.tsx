"use client";

import { Check, Copy, Download, NotebookPen, RotateCcw } from "lucide-react";
import { marked } from "marked";
import { useCallback, useMemo, useRef, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const DEFAULT_MARKDOWN = `# Markdown Live Preview

Write your markdown on the left and see it rendered in real time.

## Text Formatting

This is **bold**, this is *italic*, and this is ~~strikethrough~~.

You can also use \`inline code\` in your text.

## Lists

### Unordered

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered

1. Step one
2. Step two
3. Step three

### Task List

- [x] Write the markdown
- [x] Preview it live
- [ ] Export when ready

## Links & Images

Visit [GitHub](https://github.com) for more info.

![Placeholder image](https://via.placeholder.com/600x200/1e293b/94a3b8?text=Markdown+Preview)

## Blockquote

> The best way to predict the future is to invent it.
>
> — Alan Kay

## Table

| Feature | Supported |
|---------|-----------|
| Headings | Yes |
| Bold / Italic | Yes |
| Tables | Yes |
| Code blocks | Yes |
| Task lists | Yes |
| Images | Yes |

## Code Block

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Horizontal Rule

---

*Start editing on the left to see your changes here instantly.*`;

function useScrollSync(ref1: React.RefObject<HTMLElement | null>, ref2: React.RefObject<HTMLElement | null>) {
  const isSyncing = useRef(false);

  const handleScroll = useCallback(
    (source: React.RefObject<HTMLElement | null>, target: React.RefObject<HTMLElement | null>) => {
      if (isSyncing.current) return;
      if (!source.current || !target.current) return;
      isSyncing.current = true;

      const sourceEl = source.current;
      const targetEl = target.current;
      const ratio = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight || 1);
      targetEl.scrollTop = ratio * (targetEl.scrollHeight - targetEl.clientHeight);

      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    },
    [],
  );

  return {
    onScrollLeft: () => handleScroll(ref1, ref2),
    onScrollRight: () => handleScroll(ref2, ref1),
  };
}

export default function MarkdownLivePreviewPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const { copied, copy } = useCopyToClipboard();

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { onScrollLeft, onScrollRight } = useScrollSync(editorRef, previewRef);

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkdown("")}
              disabled={!markdown}
              className="rounded-full"
            >
              <RotateCcw size={12} />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(markdown)}
              disabled={!markdown}
              className="rounded-full font-semibold"
            >
              {copied ? (
                <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></>
              ) : (
                <><Copy size={12} />Copy MD</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMd}
              disabled={!markdown}
              className="rounded-full"
            >
              <Download size={12} />
              .md
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadHtml}
              disabled={!renderedHtml}
              className="rounded-full"
            >
              <Download size={12} />
              .html
            </Button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid h-[70vh] grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Editor
            </Label>
            <Textarea
              ref={editorRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onScroll={onScrollLeft}
              placeholder="Start writing markdown…"
              className="flex-1 resize-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Preview
            </Label>
            <div
              ref={previewRef}
              onScroll={onScrollRight}
              className="border-border bg-card prose prose-sm dark:prose-invert flex-1 overflow-y-auto rounded-xl border p-5 shadow-sm"
            >
              {renderedHtml ? (
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              ) : (
                <p className="text-muted-foreground">Preview will appear here…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
