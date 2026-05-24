"use client";

import { useEffect, useState } from "react";

import { HashAlgo } from "@/app/tools/hash-generator/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const entries = await Promise.all(
        ALGOS.map(async (a) => [a.id, await hashText(a.subtleName, text)] as const),
      );
      if (!cancelled) {
        setHashes(Object.fromEntries(entries));
        setError(null);
      }
    }

    run().catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Failed to compute hashes.");
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  const tool = internalTools.find((t) => t.slug === "hash-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-4">
        {/* Input */}
        <TextareaGroup
          label="Input Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to hash..."
          action={
            <ClearButton
              size="sm"
              onClick={() => {
                setText("");
              }}
              disabled={!text}
            />
          }
        />

        {error && <ErrorAlert message={error} />}

        {/* Hash outputs */}
        <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {ALGOS.map((algo) => {
            const value = hashes[algo.id] ?? "";

            return (
              <TextareaGroup
                key={algo.id}
                label={
                  <div className="flex items-baseline gap-4">
                    <span>{algo.name}</span>
                    <span className="font-mono text-xs">
                      {value.length ? `${value.length / 2} bytes` : ""}
                    </span>
                  </div>
                }
                readOnly
                value={value}
                action={<CopyButton iconOnly textToCopy={value} disabled={!value} />}
              />
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
