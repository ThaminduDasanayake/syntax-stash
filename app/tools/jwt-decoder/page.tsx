"use client";

import { useMemo, useState } from "react";

import { JwtDecoded } from "@/app/tools/jwt-decoder/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

function base64UrlDecode(input: string): string {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");

  const decoded = useMemo<JwtDecoded>(() => {
    const trimmed = token.trim();

    const emptyState: JwtDecoded = { header: "", payload: "", signature: "", error: null };

    if (!trimmed) return emptyState;

    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      return {
        ...emptyState,
        error: "Invalid JWT: expected 3 segments separated by '.'",
      };
    }

    try {
      const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);

      return { header, payload, signature: parts[2], error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      return { ...emptyState, error: `Decode failed: ${msg}` };
    }
  }, [token]);

  const tool = internalTools.find((t) => t.slug === "jwt-decoder");

  return (
    <ToolLayout tool={tool}>
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-full min-h-0 flex-col space-y-4">
          <TextareaGroup
            label="Encoded Token"
            value={token}
            containerClassName="flex-1 min-h-[300px]"
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            action={
              <ClearButton
                size="sm"
                onClick={() => {
                  setToken("");
                }}
                disabled={!token}
              />
            }
          />
          {decoded.error && <ErrorAlert message={decoded.error} />}
        </div>
        {/* Decoded output */}
        <div className="flex h-full min-h-0 flex-col space-y-4">
          <div className="flex min-h-40 flex-1 flex-col">
            <TextareaGroup
              label="Header"
              readOnly
              containerClassName="flex-1 min-h-0"
              value={decoded.header}
              action={
                <CopyButton iconOnly textToCopy={decoded.header} disabled={!decoded.header} />
              }
            />
          </div>
          <div className="flex min-h-45 flex-2 flex-col">
            <TextareaGroup
              label="Payload"
              readOnly
              containerClassName="flex-1 min-h-0"
              value={decoded.payload}
              action={
                <CopyButton iconOnly textToCopy={decoded.payload} disabled={!decoded.payload} />
              }
            />
          </div>
          <div className="flex min-h-20 flex-1 flex-col">
            <TextareaGroup
              label="Signature"
              readOnly
              value={decoded.signature}
              action={
                <CopyButton iconOnly textToCopy={decoded.signature} disabled={!decoded.signature} />
              }
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
