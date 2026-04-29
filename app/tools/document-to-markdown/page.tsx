"use client";

import { Check, Copy, Download, FileDown } from "lucide-react";
import { useState } from "react";

import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { buildFrontmatter, downloadMarkdown } from "./helpers";

const MAX_BYTES = 4 * 1024 * 1024;

export default function DocumentToMarkdownPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [withFrontmatter, setWithFrontmatter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { copied, copy } = useCopyToClipboard();

  const displayedMarkdown =
    withFrontmatter && rawMarkdown && fileName
      ? buildFrontmatter(fileName, new Date().toISOString().slice(0, 10)) + rawMarkdown
      : rawMarkdown;

  async function handleFileDrop(file: File) {
    setFileName(file.name);
    setRawMarkdown("");
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
        setRawMarkdown(data.text ?? "");
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ToolLayout
      icon={FileDown}
      title="Document to"
      highlight="Markdown"
      description="Convert PDF, DOCX, HTML, and text files into LLM-ready Markdown. Note: PDF output is flat text — structural headings and tables are not reconstructed."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Dropzone & Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground">File</Label>
            <FileDropzone
              onFileDropAction={handleFileDrop}
              accept=".pdf,.docx,.html,.htm,.md,.markdown,.txt"
              label="Drop a PDF, DOCX, HTML, MD, or TXT file"
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

          <div className="flex items-center gap-3">
            <Switch
              id="frontmatter-toggle"
              checked={withFrontmatter}
              onCheckedChange={setWithFrontmatter}
              disabled={!rawMarkdown}
            />
            <Label htmlFor="frontmatter-toggle" className="text-foreground cursor-pointer">
              Add YAML frontmatter
            </Label>
          </div>
        </div>

        {/* Right — Output */}
        <div className="space-y-4">
          <Label className="text-foreground">Markdown Output</Label>
          <Textarea
            readOnly
            value={displayedMarkdown}
            rows={18}
            placeholder="Markdown will appear here..."
            className="text-foreground bg-background placeholder:text-muted-foreground resize-none font-mono text-sm leading-relaxed focus-visible:ring-0"
          />
          <div className="flex gap-3">
            <Button
              onClick={() => copy(displayedMarkdown)}
              disabled={!displayedMarkdown || isLoading}
              className="hover:text-foreground text-background bg-foreground rounded-full px-6 py-2 font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={() => downloadMarkdown(displayedMarkdown, fileName ?? "document")}
              disabled={!displayedMarkdown || isLoading}
              variant="outline"
              className="rounded-full px-6 py-2 font-semibold transition-all duration-200 disabled:opacity-50"
            >
              <Download size={16} className="mr-2" />
              Download .md
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
