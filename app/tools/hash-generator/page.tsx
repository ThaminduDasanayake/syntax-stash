"use client";

import { Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";

import HashCopyButton from "@/app/tools/hash-generator/hash-copy-button";
import { HashAlgo } from "@/app/tools/hash-generator/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ALGOS: HashAlgo[] = [
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

  return (
    <ToolLayout
      icon={Fingerprint}
      title="Hash"
      highlight="Generator"
      description="SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API."
    >
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
                  <HashCopyButton value={value} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
