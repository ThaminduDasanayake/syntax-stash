"use client";

import { Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";

import { HashAlgo } from "@/app/tools/hash-generator/types";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

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

    run().catch((error) => {
      console.error("Failed to compute hashes: ", error);
    });
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
        <TextAreaField
          label="Input Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to hash..."
          rows={6}
          action={
            <ClearButton
              onClick={() => {
                setText("");
              }}
              disabled={!text}
            />
          }
        />

        {/* Hash outputs */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {ALGOS.map((algo) => {
            const value = hashes[algo.id] ?? "";

            return (
              <TextAreaField
                key={algo.id}
                label={
                  <div className="flex gap-4">
                    <span className="">{algo.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {value.length ? `${value.length / 2} bytes` : ""}
                    </span>
                  </div>
                }
                readOnly
                value={value}
                rows={4}
                action={<CopyButton value={value} disabled={!value} />}
              />
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
