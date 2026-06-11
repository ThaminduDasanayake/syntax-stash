"use client";

import { FileMdIcon, LightbulbIcon, PenNibIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { PlateEditor } from "@/blocks/editor/plate-editor";
import { ErrorAlert } from "@/components/error-alert";
import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/tool-layout";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { SwitchField } from "@/components/ui/switch-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextareaGroup } from "@/components/ui/textarea-group";
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

          <SwitchField
            label="LLM-ready Markdown"
            checked={llmReady}
            onCheckedChange={setLlmReady}
            disabled={isLoading}
          />

          <p className="text-muted-foreground text-xs">
            Note: PDF output is flat text — structural headings and tables are not reconstructed.
          </p>
        </div>

        {/* Output */}
        {llmReady ? (
          <div className="space-y-8">
            <div className="bg-muted/70 text-muted-foreground flex items-center gap-3 border px-4 py-3 text-sm">
              <LightbulbIcon weight="duotone" className="size-4.5 text-yellow-500" />
              <p>
                <strong>Pro tip:</strong> The Rich Editor supports Notion-style commands! Type{" "}
                <kbd className="bg-background border px-1.5 py-0.5 font-mono text-xs font-semibold">
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
              <div className="flex items-center justify-between gap-3 pb-3">
                <TabsList className="tab-list grid w-fit grid-cols-2">
                  <TabsTrigger value="rich" className="tab-trigger">
                    <PenNibIcon weight="duotone" className="size-4.5" />
                    Rich Editor
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="tab-trigger">
                    <FileMdIcon weight="duotone" className="size-4.5" />
                    Raw Markdown
                  </TabsTrigger>
                </TabsList>

                <div className="flex w-full items-center justify-end gap-4">
                  <SwitchField
                    label="Add YAML frontmatter"
                    checked={withFrontmatter}
                    onCheckedChange={setWithFrontmatter}
                    disabled={isLoading}
                  />

                  <div className="flex gap-2">
                    <CopyButton textToCopy={output} disabled={!markdown || isLoading} />
                    <DownloadButton
                      label="Download MD"
                      onClick={() => downloadMarkdown(output, fileName ?? "document")}
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="rich">
                <div className="bg-card flex h-full max-h-180 flex-col overflow-hidden border">
                  <PlateEditor
                    initialMarkdown={parsedMarkdown}
                    onMarkdownChangeAction={setMarkdown}
                  />
                </div>
              </TabsContent>

              <TabsContent value="raw">
                <TextareaGroup
                  autoGrow
                  label="Raw Markdown"
                  value={markdown}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setMarkdown(newValue);
                    setParsedMarkdown(newValue);
                  }}
                  className="min-h-[18lh]"
                  placeholder="Raw markdown will appear here..."
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <TextareaGroup
            autoGrow
            label="Extracted Text"
            readOnly
            value={plainText}
            placeholder="Extracted text will appear here..."
            className="min-h-50 leading-relaxed"
            action={<CopyButton textToCopy={plainText} disabled={!plainText || isLoading} />}
          />
        )}
      </div>
    </ToolLayout>
  );
}
