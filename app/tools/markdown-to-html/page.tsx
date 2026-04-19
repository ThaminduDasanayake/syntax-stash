"use client";

import { Code2 } from "lucide-react";
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
- Support for lists and code blocks

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Links

Visit [OpenAI](https://openai.com) for more info.

> This is a blockquote. It's useful for highlighting important information.

---

That's it! Enjoy converting Markdown to HTML.`);

  const htmlOutput = useMemo<string>(() => {
    if (!input.trim()) return "";

    let markdown = input;

    // Escape HTML special characters first (but we'll re-handle certain ones)
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

    // Process code blocks first (to preserve content)
    let codeBlocks: string[] = [];
    markdown = markdown.replace(/```([\s\S]*?)```/g, (match, code) => {
      const language = code.split("\n")[0].trim();
      const codeContent = code.replace(/^[^\n]*\n?/, "").trim();
      const index = codeBlocks.length;
      codeBlocks.push(`<pre><code class="language-${language || "plaintext"}">${escapeHtml(codeContent)}</code></pre>`);
      return `<!--CODE_BLOCK_${index}-->`;
    });

    // Split into lines and process
    let lines = markdown.split("\n");
    let html: string[] = [];
    let listStack: Array<"ul" | "ol"> = [];
    let inParagraph = false;
    let paragraphLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Restore code blocks temporarily to check for empty lines
      if (line.includes("<!--CODE_BLOCK")) {
        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }
        // Close any open lists
        while (listStack.length > 0) {
          html.push(`</${listStack.pop()}>`);
        }
        html.push(line);
        continue;
      }

      // Horizontal rule
      if (/^(---+|\*\*\*+|___+)$/.test(line.trim())) {
        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }
        while (listStack.length > 0) {
          html.push(`</${listStack.pop()}>`);
        }
        html.push("<hr />");
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }
        while (listStack.length > 0) {
          html.push(`</${listStack.pop()}>`);
        }
        const level = headingMatch[1].length;
        const text = processInlineMarkdown(headingMatch[2]);
        html.push(`<h${level}>${text}</h${level}>`);
        continue;
      }

      // Blockquotes
      const blockquoteMatch = line.match(/^>\s+(.+)$/);
      if (blockquoteMatch) {
        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }
        while (listStack.length > 0) {
          html.push(`</${listStack.pop()}>`);
        }
        const text = processInlineMarkdown(blockquoteMatch[1]);
        html.push(`<blockquote>${text}</blockquote>`);
        continue;
      }

      // Lists
      const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/);
      const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

      if (unorderedMatch || orderedMatch) {
        const isList = unorderedMatch ? "ul" : "ol";
        const text = processInlineMarkdown(
          (unorderedMatch || orderedMatch)![1],
        );

        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }

        if (listStack.length === 0 || listStack[listStack.length - 1] !== isList) {
          if (listStack.length > 0 && listStack[listStack.length - 1] !== isList) {
            html.push(`</${listStack.pop()}>`);
          }
          listStack.push(isList);
          html.push(`<${isList}>`);
        }

        html.push(`<li>${text}</li>`);
        continue;
      }

      // Empty line
      if (!line.trim()) {
        if (inParagraph) {
          html.push(`<p>${paragraphLines.join(" ")}</p>`);
          paragraphLines = [];
          inParagraph = false;
        }
        while (listStack.length > 0) {
          html.push(`</${listStack.pop()}>`);
        }
        continue;
      }

      // Paragraph
      if (!inParagraph) {
        inParagraph = true;
      }
      paragraphLines.push(processInlineMarkdown(line));
    }

    // Close any remaining tags
    if (inParagraph && paragraphLines.length > 0) {
      html.push(`<p>${paragraphLines.join(" ")}</p>`);
    }
    while (listStack.length > 0) {
      html.push(`</${listStack.pop()}>`);
    }

    // Replace code block placeholders
    let result = html.join("\n");
    codeBlocks.forEach((block, index) => {
      result = result.replace(`<!--CODE_BLOCK_${index}-->`, block);
    });

    return result;
  }, [input]);

  function processInlineMarkdown(text: string): string {
    // Inline code (backticks)
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");

    // Italic
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/_([^_]+)_/g, "<em>$1</em>");

    return text;
  }

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
                    __html: htmlOutput || "<p className='text-muted-foreground'>Preview will appear here...</p>",
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
            <p className="text-xs text-muted-foreground">**bold** or __bold__, *italic* or _italic_</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Code</p>
            <p className="text-xs text-muted-foreground">Inline `code` and ```code blocks```</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Lists</p>
            <p className="text-xs text-muted-foreground">- Unordered and 1. ordered lists</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Links</p>
            <p className="text-xs text-muted-foreground">[Text](https://url.com)</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Blockquotes</p>
            <p className="text-xs text-muted-foreground">&gt; Quoted text</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
