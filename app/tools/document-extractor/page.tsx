"use client";

import { Check, Copy, FileText } from "lucide-react";
import { useState } from "react";

import FileDropzone from "@/components/file-dropzone";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function DocumentExtractorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileDrop(file: File) {
    setFileName(file.name);
    setText("");
    setError(null);
    setIsLoading(true);

    try {
      // Do NOT set Content-Type — browser must set it with the multipart boundary
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/extract-text", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Extraction failed.");
      } else {
        setText(data.text ?? "");
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }
  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={FileText}
      title="Universal Document"
      highlight="Extractor"
      description="Extract clean text from PDF, DOCX, TXT, and CSV files for AI prompting."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Dropzone & Status */}
        <div className="space-y-4">
          <Label className="text-foreground">File</Label>
          <FileDropzone
            onFileDropAction={handleFileDrop}
            accept=".pdf,.docx,.txt,.csv"
            label="Drop a PDF, DOCX, TXT, or CSV file"
          />
          <div className="space-y-1">
            {fileName && (
              <p className="text-muted-foreground text-xs">
                {fileName}
                {isLoading && <span className="text-primary ml-2">Extracting...</span>}
              </p>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </div>

        {/* Right — Output */}
        <div className="space-y-4">
          <Label className="text-foreground">Extracted Text</Label>
          <Textarea
            readOnly
            value={text}
            rows={18}
            placeholder="Extracted text will appear here..."
            className="text-foreground bg-background placeholder:text-muted-foreground resize-none font-mono text-sm leading-relaxed focus-visible:ring-0"
          />
          <Button
            onClick={() => copy(text)}
            disabled={!text || isLoading}
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
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
