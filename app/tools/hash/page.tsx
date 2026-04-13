"use client";

import { ArrowLeft, Check,Copy, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Algo = { id: string; name: string; subtleName: string };

const ALGOS: Algo[] = [
  { id: "sha1", name: "SHA-1", subtleName: "SHA-1" },
  { id: "sha256", name: "SHA-256", subtleName: "SHA-256" },
  { id: "sha384", name: "SHA-384", subtleName: "SHA-384" },
  { id: "sha512", name: "SHA-512", subtleName: "SHA-512" },
];

async function hashText(subtleName: string, text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(subtleName, bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorPage() {
  const [text, setText] = useState("Hello, syntax-stash!");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const entries = await Promise.all(
        ALGOS.map(async (a) => [a.id, await hashText(a.subtleName, text)] as const),
      );
      if (!cancelled) {
        setHashes(Object.fromEntries(entries));
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [text]);

  async function handleCopy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to stash
        </Link>

        <div className="mb-12">
          <h1 className="text-foreground mb-3 flex items-center gap-3 text-4xl font-bold tracking-tighter md:text-5xl">
            <Fingerprint className="text-primary" size={36} />
            Hash <span className="text-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API.
          </p>
        </div>

        <div className="space-y-8">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-foreground">Input Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text to hash..."
              rows={6}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
            />
          </div>

          {/* Hash outputs */}
          <div className="space-y-4">
            {ALGOS.map((algo) => {
              const value = hashes[algo.id] ?? "";
              const copied = copiedId === algo.id;
              return (
                <div key={algo.id} className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <Label className="text-foreground">{algo.name}</Label>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {value.length ? `${value.length / 2} bytes` : ""}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={value}
                      className="bg-background border-border text-foreground focus-visible:ring-primary/30 h-10 font-mono text-xs focus-visible:ring-1"
                    />
                    <Button
                      onClick={() => handleCopy(algo.id, value)}
                      disabled={!value}
                      variant="outline"
                      className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent h-10 shrink-0 px-3 transition-colors"
                    >
                      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
