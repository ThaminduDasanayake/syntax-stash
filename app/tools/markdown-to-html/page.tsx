"use client";

import { Code2 } from "lucide-react";
import { marked } from "marked";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function MarkdownToHTMLPage() {
  const [input, setInput] = useState(`# Welcome to Markdown to HTML

This is a **bold text** and this is *italic text*.

## Features

- Convert Markdown to HTML
- Live preview
- Copy generated HTML
- Support for ~~strikethrough~~, **bold**, and *italic*

### Task List

- [x] Tables support
- [x] Images support
- [ ] More features coming soon

### Table Example

| Feature | Status |
|---------|--------|
| Headings | ✅ |
| Lists | ✅ |
| Tables | ✅ |
| Images | ✅ |

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Links & Images

Visit [GitHub](https://github.com) for more info.

![Placeholder](https://via.placeholder.com/200x100)

> This is a blockquote. It's useful for highlighting important information.

---

That's it! Enjoy converting Markdown to HTML.`);

  const htmlOutput = useMemo<string>(() => {
    if (!input.trim()) return "";
    try {
      return marked.parse(input, { async: false, gfm: true, breaks: false }) as string;
    } catch {
      return "<p>Error parsing markdown.</p>";
    }
  }, [input]);

  // marked escapes HTML by default — no separate sanitization needed

  return (
    <ToolLayout
      icon={Code2}
      title="Markdown"
      highlight="to HTML"
      description="Convert Markdown to HTML with live preview and export."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Markdown Input */}
        <TextAreaField
          label="Markdown Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your Markdown here..."
          rows={24}
          action={
            <ClearButton
              onClick={() => setInput("")}
              disabled={!input}
            />
          }
        />

        {/* Right: Split into Preview and HTML Output */}
        <div className="flex flex-col gap-4">
          {/* Preview Section */}
          <div className="flex-1">
            <Label className="mb-2 block">Live Preview</Label>
            <Card className="h-full">
              <CardContent className="prose prose-sm dark:prose-invert max-w-none overflow-auto p-4 h-full">
                <div
                  dangerouslySetInnerHTML={{
                    __html: htmlOutput || "<p class='text-muted-foreground'>Preview will appear here...</p>",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* HTML Output Section */}
          <div className="flex-1">
            <TextAreaField
              label="HTML Output"
              value={htmlOutput}
              readOnly
              rows={8}
              placeholder="Generated HTML will appear here..."
              action={
                <CopyButton
                  value={htmlOutput}
                  disabled={!htmlOutput}
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8 border-t pt-8">
        <h3 className="mb-4 text-sm font-semibold">Supported Markdown Features</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Headings</p>
            <p className="text-xs text-muted-foreground">H1-H6 with #, ##, etc.</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Bold & Italic</p>
            <p className="text-xs text-muted-foreground">**bold**, *italic*, ~~strikethrough~~</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Code</p>
            <p className="text-xs text-muted-foreground">Inline `code` and fenced code blocks</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Lists & Tasks</p>
            <p className="text-xs text-muted-foreground">Ordered, unordered, nested, and task lists</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Tables</p>
            <p className="text-xs text-muted-foreground">GFM tables with alignment</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Links & Images</p>
            <p className="text-xs text-muted-foreground">[text](url) and ![alt](src)</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
