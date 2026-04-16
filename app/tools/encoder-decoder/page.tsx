"use client";

import { AlertTriangle,ArrowLeft, ShieldHalf } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EncoderAction } from "@/types";

function encodeBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function decodeBase64(s: string): string {
  const binary = atob(s.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function stringToHex(s: string): string {
  const bytes = new TextEncoder().encode(s);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToString(s: string): string {
  const clean = s.replace(/\s+/g, "").replace(/^0x/i, "");
  if (clean.length === 0) return "";
  if (clean.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }
  if (!/^[0-9a-fA-F]+$/.test(clean)) {
    throw new Error("Hex string contains non-hex characters");
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

const ACTIONS: EncoderAction[] = [
  { id: "b64-enc", label: "Encode Base64", run: encodeBase64 },
  { id: "b64-dec", label: "Decode Base64", run: decodeBase64 },
  { id: "url-enc", label: "URL Encode", run: encodeURIComponent },
  { id: "url-dec", label: "URL Decode", run: decodeURIComponent },
  { id: "hex-enc", label: "String to Hex", run: stringToHex },
  { id: "hex-dec", label: "Hex to String", run: hexToString },
];

export default function EncoderPage() {
  const [input, setInput] = useState("Hello, syntax-stash!");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  function handleRun(action: EncoderAction) {
    try {
      setOutput(action.run(input));
      setError(null);
      setLastAction(action.id);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : `Failed to run ${action.label}`);
      setLastAction(action.id);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <ShieldHalf className="text-primary" size={36} />
            Encoder <span className="text-primary">/</span> Decoder
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Convert strings between Base64, URL-encoded, and Hex encodings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-foreground">Input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text or encoded string here..."
              rows={8}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <Button
                key={a.id}
                onClick={() => handleRun(a)}
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 h-9 rounded-full px-4 text-xs font-semibold transition-colors"
              >
                {a.label}
              </Button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <p className="font-mono">{error}</p>
            </div>
          )}

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label className="text-foreground">Output</Label>
              {lastAction && !error && (
                <span className="text-muted-foreground font-mono text-xs">
                  {ACTIONS.find((a) => a.id === lastAction)?.label}
                </span>
              )}
            </div>
            <Textarea
              readOnly
              value={output}
              placeholder="Run an action to see the result..."
              rows={8}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed break-all focus-visible:ring-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
