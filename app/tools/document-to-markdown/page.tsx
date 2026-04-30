"use client";

import { Download, FileDown } from "lucide-react";
import { useState } from "react";

import Editor from "@/app/tools/document-to-markdown/editor.tsx";
import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { composeOutput, downloadMarkdown } from "./helpers";

const MAX_BYTES = 4 * 1024 * 1024;

export default function DocumentToMarkdownPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedMarkdown, setParsedMarkdown] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [withFrontmatter, setWithFrontmatter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileDrop(file: File) {
    setFileName(file.name);
    setParsedMarkdown("");
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
        setParsedMarkdown(data.text ?? "");
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const output = composeOutput(markdown, withFrontmatter, fileName);

  return (
    <ToolLayout
      icon={FileDown}
      title="Document to"
      highlight="Markdown"
      description="Convert PDF, DOCX, HTML, and text files into Markdown."
    >
      <div className="flex flex-col gap-8">
        {/* Dropzone & Options */}
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

        {/* Output */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Switch
                id="frontmatter-toggle"
                checked={withFrontmatter}
                onCheckedChange={setWithFrontmatter}
                disabled={isLoading}
              />
              <Label htmlFor="frontmatter-toggle" className="text-foreground cursor-pointer">
                Add YAML frontmatter
              </Label>
            </div>
            <div className="flex gap-3">
              <CopyButton value={output} disabled={!markdown || isLoading} />
              <Button
                onClick={() => downloadMarkdown(output, fileName ?? "document")}
                disabled={!markdown || isLoading}
                variant="secondary"
              >
                <Download />
                Download .md
              </Button>
            </div>
          </div>

          <Editor />
        </div>
      </div>
    </ToolLayout>
  );
}
