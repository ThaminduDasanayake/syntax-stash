"use client";

import { Code2, Columns, Download, Eye, FileDown } from "lucide-react";
import { marked } from "marked";
import { useMemo, useState } from "react";

import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";

import { buildFrontmatter, downloadMarkdown } from "./helpers";

const MAX_BYTES = 4 * 1024 * 1024;

export default function DocumentToMarkdownPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [withFrontmatter, setWithFrontmatter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderedHtml = useMemo(() => {
    if (!markdown.trim()) return "";
    try {
      return marked.parse(markdown, { async: false, gfm: true, breaks: true }) as string;
    } catch {
      return "<p>Error parsing markdown.</p>";
    }
  }, [markdown]);

  async function handleFileDrop(file: File) {
    setFileName(file.name);
    setMarkdown("");
    setError(null);

    if (file.size > MAX_BYTES) {
      setError(
        "File exceeds 4 MB. Vercel/Next.js serverless limits apply — split or compress the document.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-text", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Conversion failed.");
      } else {
        let extractedText = data.text ?? "";
        if (withFrontmatter) {
          extractedText =
            buildFrontmatter(file.name, new Date().toISOString().slice(0, 10)) + extractedText;
        }
        setMarkdown(extractedText);
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleFrontmatter(checked: boolean) {
    setWithFrontmatter(checked);
    if (!fileName) return;

    if (checked) {
      // Prepend frontmatter
      const fm = buildFrontmatter(fileName, new Date().toISOString().slice(0, 10));
      setMarkdown((prev) => fm + prev);
    } else {
      // Strip frontmatter using regex if it's turned off
      setMarkdown((prev) => prev.replace(/^---[\s\S]*?---\n*/, ""));
    }
  }

  const EditorPane = (
    <TextAreaField
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      rows={18}
      placeholder="Markdown will appear here... Feel free to type and edit!"
      className="h-full"
    />
  );

  const PreviewPane = (
    <div className="border-input bg-card prose prose-sm dark:prose-invert h-full min-h-107 max-w-none overflow-y-auto rounded-md border px-3 py-2">
      {renderedHtml ? (
        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      ) : (
        <p className="text-muted-foreground">Preview will appear here…</p>
      )}
    </div>
  );

  return (
    <ToolLayout
      icon={FileDown}
      title="Document to"
      highlight="Markdown"
      description="Convert PDF, DOCX, HTML, and text files into Markdown."
    >
      <div className="flex flex-col gap-8">
        {/* Left — Dropzone & Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground">File</Label>
            <FileDropzone
              onFileDropAction={handleFileDrop}
              accept=".pdf,.docx,.html,.htm,.md,.markdown,.txt"
              label="Drop a PDF, DOCX, HTML, MD, or TXT file (Max size: 4 MB)"
            />
            <div className="space-y-1">
              {fileName && (
                <p className="text-muted-foreground text-xs">
                  {fileName}
                  {isLoading && <span className="text-primary ml-2">Converting...</span>}
                </p>
              )}
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Note: PDF output is flat text — structural headings and tables are not reconstructed.
          </p>
        </div>

        {/* Right — Output */}
        <div className="space-y-4">
          <Tabs defaultValue="code" className="flex flex-col">
            <div className="grid grid-cols-2 flex-wrap items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger className="tab-trigger" value="code">
                  <Code2 />
                  Code
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="preview">
                  <Eye />
                  Preview
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="split">
                  <Columns />
                  Split
                </TabsTrigger>
              </TabsList>

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    id="frontmatter-toggle"
                    checked={withFrontmatter}
                    onCheckedChange={handleToggleFrontmatter}
                    disabled={!markdown && isLoading}
                  />
                  <Label htmlFor="frontmatter-toggle" className="text-foreground cursor-pointer">
                    Add YAML frontmatter
                  </Label>
                </div>

                <div className="flex gap-3">
                  <CopyButton value={markdown} disabled={!markdown || isLoading} />
                  <Button
                    onClick={() => downloadMarkdown(markdown, fileName ?? "document")}
                    disabled={!markdown || isLoading}
                    variant="secondary"
                  >
                    <Download />
                    Download .md
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="code">{EditorPane}</TabsContent>

            <TabsContent value="preview">{PreviewPane}</TabsContent>

            {/* 5. The Dual View Content */}
            <TabsContent value="split">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {EditorPane}
                {PreviewPane}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
