"use client";

import { Download, FileCode2, FileDown, Lightbulb, PenTool } from "lucide-react";
import { useState } from "react";

import Editor from "@/app/tools/document-to-markdown/editor.tsx";
import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field.tsx";

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
          <div className="bg-muted/70 text-muted-foreground flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
            <Lightbulb className="text-yellow-500" size={18} />
            <p>
              <strong>Pro tip:</strong> The Rich Editor supports Notion-style commands! Type{" "}
              <kbd className="bg-background border-border rounded border px-1.5 py-0.5 font-mono text-xs font-semibold">
                /
              </kbd>{" "}
              on any new line to quickly add headings, lists, and formatting.
            </p>
          </div>

          <Tabs
            defaultValue="rich"
            className="flex flex-col gap-4"
            onValueChange={(tab) => {
              if (tab === "rich") {
                setParsedMarkdown(markdown);
              }
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList className="w-xs">
                <TabsTrigger value="rich" className="tab-trigger">
                  <PenTool size={16} />
                  Rich Editor
                </TabsTrigger>
                <TabsTrigger value="raw" className="tab-trigger">
                  <FileCode2 size={16} />
                  Raw Markdown
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
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
                <div className="flex gap-2">
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
            </div>

            <TabsContent value="rich">
              <Editor initialMarkdown={parsedMarkdown} onChange={setMarkdown} />
            </TabsContent>

            <TabsContent value="raw">
              <TextAreaField
                value={markdown}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setMarkdown(newValue);
                  setParsedMarkdown(newValue);
                }}
                className="field-sizing-content min-h-[18lh]"
                placeholder="Raw markdown will appear here..."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
}
