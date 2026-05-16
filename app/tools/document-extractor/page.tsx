"use client";

import { FileMdIcon, LightbulbIcon, PenNibIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import FileDropzone from "@/components/file-dropzone";
import RichMarkdownEditor from "@/components/rich-markdown-editor";
import { ToolLayout } from "@/components/tool-layout";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
import { buildAcceptMap } from "@/lib/file-types";
import { internalTools } from "@/lib/tools-data";

import { composeOutput, downloadMarkdown } from "./helpers";

const MAX_BYTES = 4 * 1024 * 1024;

export default function DocumentExtractorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedMarkdown, setParsedMarkdown] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [plainText, setPlainText] = useState("");
  const [withFrontmatter, setWithFrontmatter] = useState(false);
  const [llmReady, setLlmReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileDrop(file: File) {
    setFileName(file.name);
    setParsedMarkdown("");
    setMarkdown("");
    setPlainText("");
    setError(null);

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-text", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Extraction failed.");
      } else {
        const extracted = data.text ?? "";
        setParsedMarkdown(extracted);
        setMarkdown(extracted);
        setPlainText(extracted);
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const output = composeOutput(markdown, withFrontmatter, fileName);

  const tool = internalTools.find((t) => t.slug === "document-extractor");

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col gap-8">
        {/* Dropzone & Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <FileDropzone
              onFileDropAction={handleFileDrop}
              maxSize={MAX_BYTES}
              onReject={(errorMsg) => setError(errorMsg)}
              accept={buildAcceptMap([".pdf", ".docx", ".html", ".htm", ".md", ".txt", ".csv"])}
              label={
                <>
                  <p className="text-foreground font-medium">Drop a document (Max size: 4 MB)</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Supports PDF, DOCX, HTML, MD, TXT, or CSV file
                  </p>
                </>
              }
            />
            <div className="space-y-1">
              {fileName && (
                <p className="text-muted-foreground text-xs">
                  {fileName}
                  {isLoading && <span className="text-primary ml-2">Extracting...</span>}
                </p>
              )}
              {error && <ErrorAlert message={error} />}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="llm-ready-toggle"
              checked={llmReady}
              onCheckedChange={setLlmReady}
              disabled={isLoading}
            />
            <Label htmlFor="llm-ready-toggle" className="text-foreground cursor-pointer">
              LLM-ready Markdown
            </Label>
            <span className="text-muted-foreground text-xs">
              — rich editor, YAML frontmatter, and .md download
            </span>
          </div>

          <p className="text-muted-foreground text-xs">
            Note: PDF output is flat text — structural headings and tables are not reconstructed.
          </p>
        </div>

        {/* Output */}
        {llmReady ? (
          <div className="space-y-4">
            <div className="bg-muted/70 text-muted-foreground flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
              <LightbulbIcon weight="duotone" className="size-4.5 text-yellow-500" />
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
                    <PenNibIcon weight="duotone" className="size-4.5" />
                    Rich Editor
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="tab-trigger">
                    <FileMdIcon weight="duotone" className="size-4.5" />
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
                    <CopyButton textToCopy={output} disabled={!markdown || isLoading} />
                    <DownloadButton
                      label="Download .md"
                      onClick={() => downloadMarkdown(output, fileName ?? "document")}
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="rich">
                <RichMarkdownEditor initialMarkdown={parsedMarkdown} onChange={setMarkdown} />
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
        ) : (
          <TextAreaField
            label="Extracted Text"
            readOnly
            value={plainText}
            rows={18}
            placeholder="Extracted text will appear here..."
            className="resize-none text-sm leading-relaxed"
            action={<CopyButton textToCopy={plainText} disabled={!plainText || isLoading} />}
          />
        )}
      </div>
    </ToolLayout>
  );
}
