"use client";

import { useCallback, useEffect, useState } from "react";

import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

type Algorithm = "HS256" | "HS384" | "HS512";

const ALGO_MAP: Record<Algorithm, { subtleName: string; hash: string }> = {
  HS256: { hash: "SHA-256", subtleName: "HMAC" },
  HS384: { hash: "SHA-384", subtleName: "HMAC" },
  HS512: { hash: "SHA-512", subtleName: "HMAC" },
};

const DEFAULT_PAYLOAD = JSON.stringify(
  {
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    name: "Jane Doe",
    sub: "1234567890",
  },
  null,
  2,
);

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encodeUtf8(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

async function signJWT(algo: Algorithm, secret: string, payload: string): Promise<string> {
  const { hash, subtleName } = ALGO_MAP[algo];

  const header = { alg: algo, typ: "JWT" };
  const headerEncoded = base64UrlEncode(encodeUtf8(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(encodeUtf8(payload));
  const signingInput = `${headerEncoded}.${payloadEncoded}`;

  const keyData = encodeUtf8(secret);
  const key = await crypto.subtle.importKey("raw", keyData, { hash, name: subtleName }, false, [
    "sign",
  ]);

  const sig = await crypto.subtle.sign(subtleName, key, encodeUtf8(signingInput));
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

const ALGO_OPTIONS: { value: Algorithm; label: string }[] = [
  { label: "HS256", value: "HS256" },
  { label: "HS384", value: "HS384" },
  { label: "HS512", value: "HS512" },
];

export default function JwtGeneratorPage() {
  const [algo, setAlgo] = useState<Algorithm>("HS256");
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    setError("");
    if (!secret.trim()) {
      setError("Secret key is required.");
      setToken("");
      return;
    }
    try {
      JSON.parse(payload);
    } catch {
      setError("Payload must be valid JSON.");
      setToken("");
      return;
    }
    try {
      const t = await signJWT(algo, secret, payload);
      setToken(t);
    } catch (e) {
      setError((e as Error).message);
      setToken("");
    }
  }, [algo, payload, secret]);

  useEffect(() => {
    generate();
  }, [generate]);

  const parts = token.split(".");
  const headerDecoded = parts[0]
    ? atob(
        parts[0]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(Math.ceil(parts[0].length / 4) * 4, "="),
      )
    : "";

  const tool = internalTools.find((t) => t.slug === "jwt-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6">
          <SelectField
            label="Algorithm"
            value={algo}
            onValueChange={(v) => setAlgo(v as Algorithm)}
            options={ALGO_OPTIONS}
            triggerClassName="w-36"
          />

          <InputField
            label="Secret Key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="your-secret-key"
            type="text"
          />

          <TextareaGroup
            label="Payload (JSON)"
            value={payload}
            autoGrow
            containerClassName="min-h-[200px]"
            onChange={(e) => setPayload(e.target.value)}
            placeholder='{ "sub": "123", "name": "Alice" }'
            action={<ClearButton size="sm" onClick={() => setPayload("{}")} disabled={!payload} />}
          />

          {/* Header preview */}
          <div className="bg-muted space-y-1 rounded-lg p-4">
            <p className="text-muted-foreground text-xs font-medium">Header (auto-generated)</p>
            <p className="font-mono text-sm break-all">
              {headerDecoded || `{"alg":"${algo}","typ":"JWT"}`}
            </p>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {error && <ErrorAlert message={error} />}

          <TextareaGroup
            label="Signed JWT"
            value={token}
            autoGrow
            readOnly
            containerClassName="min-h-[140px]"
            placeholder="Token will appear here…"
            action={<CopyButton iconOnly textToCopy={token} disabled={!token} />}
          />

          {/* Coloured token breakdown */}
          {token && (
            <div className="bg-muted space-y-2 rounded-lg p-4">
              <p className="text-muted-foreground text-xs font-medium">Token breakdown</p>
              <p className="font-mono text-sm leading-relaxed break-all">
                <span className="text-pink-500">{parts[0]}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-purple-500">{parts[1]}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-sky-500">{parts[2]}</span>
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs">
                <span className="font-medium text-pink-500">Header</span>
                <span className="font-medium text-purple-500">Payload</span>
                <span className="font-medium text-sky-500">Signature</span>
              </div>
            </div>
          )}

          <Button onClick={generate} className="w-full">
            Sign Token
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
