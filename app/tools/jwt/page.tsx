"use client";

import { AlertTriangle,ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JwtDecoded } from "@/types";

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
    if (!trimmed) return { ok: true, header: "", payload: "", signature: "" };

    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      return {
        ok: false,
        error: "Invalid JWT: expected 3 segments separated by '.'",
      };
    }

    try {
      const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
      return { ok: true, header, payload, signature: parts[2] };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      return { ok: false, error: `Decode failed: ${msg}` };
    }
  }, [token]);

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
            <KeyRound className="text-primary" size={36} />
            JWT <span className="text-primary">Decoder</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Decode and inspect JSON Web Tokens locally. Nothing leaves your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — token input */}
          <div className="space-y-4">
            <Label className="text-foreground">Encoded Token</Label>
            <Textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              rows={18}
              className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed break-all focus-visible:ring-1"
            />
            {decoded.ok === false && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>{decoded.error}</p>
              </div>
            )}
          </div>

          {/* Right — decoded output */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">Header</Label>
              <Textarea
                readOnly
                value={decoded.ok ? decoded.header : ""}
                rows={6}
                className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Payload</Label>
              <Textarea
                readOnly
                value={decoded.ok ? decoded.payload : ""}
                rows={10}
                className="bg-background border-border text-foreground focus-visible:ring-primary/30 resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
              />
            </div>
            {decoded.ok && decoded.signature && (
              <div className="space-y-2">
                <Label className="text-foreground">Signature</Label>
                <p className="border-border bg-background text-muted-foreground rounded-lg border px-3 py-2 font-mono text-xs break-all">
                  {decoded.signature}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
