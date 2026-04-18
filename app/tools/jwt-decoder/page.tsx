"use client";

import { KeyRound } from "lucide-react";
import { useMemo, useState } from "react";

import { JwtDecoded } from "@/app/tools/jwt-decoder/types";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

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

  return (
    <ToolLayout
      icon={KeyRound}
      title="JWT"
      highlight="Decoder"
      description="Decode and inspect JSON Web Tokens locally. Nothing leaves your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <TextAreaField
            label="Encoded Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={26}
            action={
              <ClearButton
                onClick={() => {
                  setToken("");
                }}
                disabled={!token}
              />
            }
          />
          {decoded.error && <ErrorAlert message={decoded.error} />}
        </div>

        {/* Right — decoded output */}
        <div className="space-y-3">
          <TextAreaField
            label="Header"
            readOnly
            value={decoded.header}
            rows={8}
            action={<CopyButton value={decoded.header} disabled={!decoded.header} />}
          />
          <TextAreaField
            label="Payload"
            readOnly
            value={decoded.payload}
            rows={10}
            action={<CopyButton value={decoded.payload} disabled={!decoded.payload} />}
          />

          <TextAreaField
            label="Signature"
            readOnly
            value={decoded.signature}
            rows={2}
            action={<CopyButton value={decoded.signature} disabled={!decoded.signature} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
