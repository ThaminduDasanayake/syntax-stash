"use client";

import { ArrowLeft, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold tracking-tighter text-white md:text-5xl">
            Universal Document <span className="text-orange-500">Extractor</span>
          </h1>
          <p className="text-base text-zinc-400 md:text-lg">
            Extract clean text from PDF, DOCX, TXT, and CSV files for AI prompting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — Dropzone & Status */}
          <div className="space-y-4">
            <Label className="text-zinc-300">File</Label>
            <FileDropzone
              onFileDropAction={handleFileDrop}
              accept=".pdf,.docx,.txt,.csv"
              label="Drop a PDF, DOCX, TXT, or CSV file"
            />
            <div className="space-y-1">
              {fileName && (
                <p className="text-xs text-zinc-400">
                  {fileName}
                  {isLoading && <span className="ml-2 text-orange-400">Extracting...</span>}
                </p>
              )}
              {error && <p className="text-sm text-red-400">{error}</p>}
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
              className="resize-none border-white/10 bg-[#0C0C0C] font-mono text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-700 focus-visible:border-white/10 focus-visible:ring-0"
            />
            <Button
              onClick={handleCopy}
              disabled={!text || isLoading}
              className="rounded-full bg-white px-6 py-2 font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 disabled:opacity-50"
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
