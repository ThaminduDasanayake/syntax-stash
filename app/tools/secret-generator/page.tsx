"use client";

import { ArrowsClockwiseIcon, CheckIcon, CopyIcon, TerminalIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Encoding = "base64" | "base64url" | "hex" | "alphanum";

interface Preset {
  id: string;
  label: string;
  tag: string;
  bytes: number;
  encoding: Encoding;
  prefix: string;
  envKey: string;
  description: string;
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS: Preset[] = [
  {
    id: "aes128",
    bytes: 16,
    description: "128-bit AES symmetric encryption key",
    encoding: "hex",
    envKey: "ENCRYPTION_KEY",
    label: "AES-128 Key",
    prefix: "",
    tag: "Encryption",
  },
  {
    id: "aes256",
    bytes: 32,
    description: "256-bit AES symmetric encryption key",
    encoding: "hex",
    envKey: "ENCRYPTION_KEY",
    label: "AES-256 Key",
    prefix: "",
    tag: "Encryption",
  },
  {
    id: "api-key",
    bytes: 32,
    description: 'URL-safe key with "sk_" prefix — like Stripe / OpenAI',
    encoding: "base64url",
    envKey: "API_KEY",
    label: "API Key",
    prefix: "sk_",
    tag: "General",
  },
  {
    id: "cookie",
    bytes: 32,
    description: "For iron-session, express-session, cookie signing",
    encoding: "hex",
    envKey: "COOKIE_SECRET",
    label: "Cookie Signing Secret",
    prefix: "",
    tag: "General",
  },
  {
    id: "custom",
    bytes: 32,
    description: "Configure your own byte length, encoding, and prefix",
    encoding: "hex",
    envKey: "SECRET",
    label: "Custom",
    prefix: "",
    tag: "Custom",
  },
  {
    id: "django",
    bytes: 50,
    description: "50-char alphanumeric+symbols secret (django-insecure- prefix removed)",
    encoding: "alphanum",
    envKey: "SECRET_KEY",
    label: "Django SECRET_KEY",
    prefix: "",
    tag: "Django",
  },
  {
    id: "hmac512",
    bytes: 64,
    description: "512-bit key for HMAC-SHA512 message authentication",
    encoding: "hex",
    envKey: "HMAC_KEY",
    label: "HMAC-SHA512 Key",
    prefix: "",
    tag: "Crypto",
  },
  {
    id: "jwt",
    bytes: 32,
    description: "HMAC-SHA256 signing secret (256-bit)",
    encoding: "base64",
    envKey: "JWT_SECRET",
    label: "JWT Secret",
    prefix: "",
    tag: "General",
  },
  {
    id: "laravel",
    bytes: 32,
    description: 'php artisan key:generate equivalent — "base64:" prefix required',
    encoding: "base64",
    envKey: "APP_KEY",
    label: "Laravel APP_KEY",
    prefix: "base64:",
    tag: "Laravel",
  },
  {
    id: "nextauth",
    bytes: 32,
    description: "AUTH_SECRET for Next.js Auth.js (npx auth secret)",
    encoding: "base64",
    envKey: "AUTH_SECRET",
    label: "NextAuth / Auth.js",
    prefix: "",
    tag: "Next.js",
  },
  {
    id: "rails",
    bytes: 64,
    description: "128-hex-char key — rails secret equivalent",
    encoding: "hex",
    envKey: "SECRET_KEY_BASE",
    label: "Rails secret_key_base",
    prefix: "",
    tag: "Rails",
  },
  {
    id: "webhook",
    bytes: 32,
    description: 'Hex secret with "whsec_" prefix — used by Stripe webhooks',
    encoding: "hex",
    envKey: "WEBHOOK_SECRET",
    label: "Webhook Secret",
    prefix: "whsec_",
    tag: "General",
  },
];

// ─── Crypto helpers ───────────────────────────────────────────────────────────

const ALPHANUM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+";

function generateSecret(bytes: number, encoding: Encoding): string {
  if (encoding === "alphanum") {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => ALPHANUM_CHARS[b % ALPHANUM_CHARS.length])
      .join("");
  }

  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);

  if (encoding === "hex") {
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // base64 / base64url
  let binary = "";
  arr.forEach((b) => (binary += String.fromCharCode(b)));
  const b64 = btoa(binary);
  if (encoding === "base64url") {
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  return b64;
}

function opensslCommand(bytes: number, encoding: Encoding): string {
  if (encoding === "hex") return `openssl rand -hex ${bytes}`;
  if (encoding === "base64" || encoding === "base64url") return `openssl rand -base64 ${bytes}`;
  return `openssl rand ${bytes} | base64`;
}

function entropyBits(bytes: number): number {
  return bytes * 8;
}

function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 128) return { color: "text-yellow-500", label: "Fair" };
  if (bits < 192) return { color: "text-emerald-500", label: "Strong" };
  return { color: "text-green-500", label: "Very Strong" };
}

// ─── Components ───────────────────────────────────────────────────────────────

const ENCODING_OPTIONS: { value: Encoding; label: string }[] = [
  { label: "Alphanumeric + symbols", value: "alphanum" },
  { label: "Base64", value: "base64" },
  { label: "Base64URL (URL-safe)", value: "base64url" },
  { label: "Hex", value: "hex" },
];

const TAG_COLORS: Record<string, string> = {
  Crypto: "bg-red-500/10 text-red-600 dark:text-red-400",
  Custom: "bg-muted text-muted-foreground",
  Django: "bg-green-500/10 text-green-600 dark:text-green-400",
  Encryption: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  General: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Laravel: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Next.js": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Rails: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function useCopyState() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);
  return { copiedKey, copy };
}

export default function SecretGeneratorPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>("nextauth");
  const [bytes, setBytes] = useState(32);
  const [encoding, setEncoding] = useState<Encoding>("base64");
  const [prefix, setPrefix] = useState("");
  const [envKey, setEnvKey] = useState("AUTH_SECRET");
  const [count, setCount] = useState(3);
  const [secrets, setSecrets] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);
  const { copiedKey, copy } = useCopyState();

  const preset = PRESETS.find((p) => p.id === selectedPreset) ?? PRESETS[0];

  // Apply preset values
  const applyPreset = (p: Preset) => {
    setSelectedPreset(p.id);
    if (p.id !== "custom") {
      setBytes(p.bytes);
      setEncoding(p.encoding);
      setPrefix(p.prefix);
      setEnvKey(p.envKey);
    }
  };

  // Regenerate secrets
  const generate = useCallback(() => {
    setSecrets(Array.from({ length: count }, () => prefix + generateSecret(bytes, encoding)));
  }, [bytes, count, encoding, prefix]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bytes, count, encoding, prefix, seed]);

  const bits = entropyBits(bytes);
  const strength = strengthLabel(bits);
  const cmd = opensslCommand(bytes, encoding);
  const encodedLength = secrets[0]?.replace(prefix, "").length ?? 0;

  const tool = internalTools.find((t) => t.slug === "secret-generator");

  return (
    <ToolLayout tool={tool}>
      {/* ── Presets ── */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium">Presets</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={cn(
                "group flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-all",
                selectedPreset === p.id
                  ? "border-primary bg-primary/5 ring-primary/30 ring-1"
                  : "hover:border-border/80 hover:bg-muted/50",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm leading-tight font-medium">{p.label}</span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    TAG_COLORS[p.tag] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {p.tag}
                </span>
              </div>
              <span className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                {p.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Config panel ── */}
        <div className="space-y-5 lg:col-span-1">
          <SliderField
            label={`Byte length: ${bytes} bytes (${bits} bits)`}
            value={[bytes]}
            min={8}
            max={128}
            step={8}
            onValueChange={([v]) => {
              setBytes(v);
              setSelectedPreset("custom");
            }}
          />

          <SelectField
            label="Encoding"
            value={encoding}
            onValueChange={(v) => {
              setEncoding(v as Encoding);
              setSelectedPreset("custom");
            }}
            options={ENCODING_OPTIONS}
          />

          <InputField
            label="Prefix (optional)"
            value={prefix}
            onChange={(e) => {
              setPrefix(e.target.value);
              setSelectedPreset("custom");
            }}
            placeholder="e.g. sk_, whsec_, base64:"
          />

          <InputField
            label=".env variable name"
            value={envKey}
            onChange={(e) => setEnvKey(e.target.value)}
            placeholder="SECRET_KEY"
          />

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant={count === n ? "default" : "outline"}
                  onClick={() => setCount(n)}
                  className="flex-1"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-muted divide-y rounded-lg text-sm">
            <div className="flex justify-between px-3 py-2">
              <span className="text-muted-foreground">Entropy</span>
              <span className="font-semibold">{bits} bits</span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span className="text-muted-foreground">Strength</span>
              <span className={cn("font-semibold", strength.color)}>{strength.label}</span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span className="text-muted-foreground">Encoded length</span>
              <span className="font-semibold">{encodedLength} chars</span>
            </div>
            <div className="flex justify-between px-3 py-2">
              <span className="text-muted-foreground">Encoding</span>
              <span className="font-semibold capitalize">{encoding}</span>
            </div>
          </div>
        </div>

        {/* ── Output panel ── */}
        <div className="space-y-4 lg:col-span-2">
          {/* Regenerate */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Generated secrets</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setSeed((s) => s + 1)}
            >
              <ArrowsClockwiseIcon weight="bold" size={14} />
              Regenerate
            </Button>
          </div>

          {/* Secret list */}
          <div className="space-y-2">
            {secrets.map((secret, i) => {
              const envLine = `${envKey}=${secret}`;
              const isCopiedSecret = copiedKey === `secret-${i}`;
              const isCopiedEnv = copiedKey === `env-${i}`;
              return (
                <div key={i} className="bg-muted rounded-lg border">
                  {/* Secret value row */}
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <span className="flex-1 font-mono text-sm leading-relaxed break-all">
                      {secret}
                    </span>
                    <button
                      onClick={() => copy(`secret-${i}`, secret)}
                      title="Copy secret"
                      className={cn(
                        "shrink-0 transition-colors",
                        isCopiedSecret
                          ? "text-green-500"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isCopiedSecret ? (
                        <CheckIcon weight="bold" size={15} />
                      ) : (
                        <CopyIcon size={15} />
                      )}
                    </button>
                  </div>

                  {/* .env line row */}
                  <div className="flex items-center gap-2 border-t px-3 py-1.5">
                    <span className="text-muted-foreground mr-1 shrink-0 font-mono text-xs">
                      .env
                    </span>
                    <span className="flex-1 truncate font-mono text-xs opacity-70">{envLine}</span>
                    <button
                      onClick={() => copy(`env-${i}`, envLine)}
                      title="Copy .env line"
                      className={cn(
                        "shrink-0 transition-colors",
                        isCopiedEnv
                          ? "text-green-500"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isCopiedEnv ? <CheckIcon weight="bold" size={13} /> : <CopyIcon size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Copy all .env lines */}
          {secrets.length > 1 && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy("all-env", secrets.map((s) => `${envKey}=${s}`).join("\n"))}
                className="gap-2"
              >
                {copiedKey === "all-env" ? (
                  <CheckIcon weight="bold" size={13} />
                ) : (
                  <CopyIcon size={13} />
                )}
                Copy all as .env lines
              </Button>
            </div>
          )}

          {/* openssl equivalent */}
          <div className="mt-2 rounded-lg border">
            <div className="text-muted-foreground flex items-center gap-2 border-b px-3 py-2 text-xs font-medium">
              <TerminalIcon size={13} />
              Equivalent shell command
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <code className="flex-1 font-mono text-sm">{cmd}</code>
              <button
                onClick={() => copy("cmd", cmd)}
                title="Copy command"
                className={cn(
                  "shrink-0 transition-colors",
                  copiedKey === "cmd"
                    ? "text-green-500"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {copiedKey === "cmd" ? (
                  <CheckIcon weight="bold" size={15} />
                ) : (
                  <CopyIcon size={15} />
                )}
              </button>
            </div>
          </div>

          {/* Preset description callout */}
          {selectedPreset !== "custom" && (
            <p className="text-muted-foreground border-l-2 pl-3 text-xs leading-relaxed">
              <span className="text-foreground font-semibold">{preset.label}:</span>{" "}
              {preset.description}
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
