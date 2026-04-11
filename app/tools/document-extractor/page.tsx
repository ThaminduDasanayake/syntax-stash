"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileDropzone from "@/components/FileDropzone";

export default function DocumentExtractorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="hacker-grid min-h-screen">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 text-sm"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-3">
            Universal Document <span className="text-orange-500">Extractor</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Extract clean text from PDF, DOCX, TXT, and CSV files for AI prompting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Dropzone & Status */}
          <div className="space-y-4">
            <Label className="text-zinc-300">File</Label>
            <FileDropzone
              onFileDrop={handleFileDrop}
              accept=".pdf,.docx,.txt,.csv"
              label="Drop a PDF, DOCX, TXT, or CSV file"
            />
            <div className="space-y-1">
              {fileName && (
                <p className="text-zinc-400 text-xs">
                  {fileName}
                  {isLoading && (
                    <span className="text-orange-400 ml-2">Extracting...</span>
                  )}
                </p>
              )}
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          </div>

          {/* Right — Output */}
          <div className="space-y-4">
            <Label className="text-zinc-300">Extracted Text</Label>
            <Textarea
              readOnly
              value={text}
              rows={18}
              placeholder="Extracted text will appear here..."
              className="bg-[#0C0C0C] border-white/10 text-zinc-200 font-mono text-sm leading-relaxed resize-none focus-visible:ring-0 focus-visible:border-white/10 placeholder:text-zinc-700"
            />
            <Button
              onClick={handleCopy}
              disabled={!text || isLoading}
              className="rounded-full px-6 py-2 bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50"
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
      </div>
    </div>
  );
}
