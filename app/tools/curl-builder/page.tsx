"use client";

import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
type AuthType = "none" | "bearer" | "basic" | "api-key";
type Mode = "build" | "parse";

type Header = { key: string; value: string };
type Param = { key: string; value: string };

type ParsedCurl = {
  method: string;
  url: string;
  headers: Header[];
  body: string;
  auth: string;
  flags: string[];
};

const METHODS: HttpMethod[] = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"];

const AUTH_TYPES = [
  { label: "API Key Header", value: "api-key" },
  { label: "Basic Auth (user:pass)", value: "basic" },
  { label: "Bearer Token", value: "bearer" },
  { label: "None", value: "none" },
];

function buildCurl(
  method: HttpMethod,
  url: string,
  headers: Header[],
  params: Param[],
  body: string,
  authType: AuthType,
  authValue: string,
  followRedirects: boolean,
  verbose: boolean,
): string {
  const parts: string[] = ["curl"];

  if (verbose) parts.push("-v");
  if (followRedirects) parts.push("-L");
  if (method !== "GET") parts.push(`-X ${method}`);

  // Auth
  if (authType === "bearer" && authValue) {
    parts.push(`-H 'Authorization: Bearer ${authValue}'`);
  } else if (authType === "basic" && authValue) {
    parts.push(`-u '${authValue}'`);
  } else if (authType === "api-key" && authValue) {
    parts.push(`-H 'X-API-Key: ${authValue}'`);
  }

  // Headers
  headers
    .filter((h) => h.key)
    .forEach((h) => {
      parts.push(`-H '${h.key}: ${h.value}'`);
    });

  // Body
  if (body.trim()) {
    parts.push(`-d '${body.trim()}'`);
  }

  // URL with query params
  let fullUrl = url.trim() || "https://api.example.com/endpoint";
  const queryParts = params.filter((p) => p.key);
  if (queryParts.length > 0) {
    const qs = queryParts
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
  }

  parts.push(`'${fullUrl}'`);

  // Break long commands
  return parts.join(" \\\n  ");
}

function parseCurl(raw: string): ParsedCurl {
  const result: ParsedCurl = { auth: "", body: "", flags: [], headers: [], method: "GET", url: "" };

  // Remove line continuations
  const input = raw.replace(/\\\n\s*/g, " ").trim();
  if (!input.startsWith("curl")) return result;

  // Method
  const methodMatch = input.match(/-X\s+([A-Z]+)/);
  if (methodMatch) result.method = methodMatch[1];

  // URL — find the first quoted or bare http(s) argument
  const urlMatch = input.match(/(?:^|\s)'(https?:\/\/[^']+)'|(?:^|\s)(https?:\/\/\S+)/);
  if (urlMatch) result.url = urlMatch[1] ?? urlMatch[2] ?? "";

  // Headers
  const headerRe = /-H\s+'([^']+)'|-H\s+"([^"]+)"/g;
  let hm: RegExpExecArray | null;
  while ((hm = headerRe.exec(input)) !== null) {
    const raw = hm[1] ?? hm[2] ?? "";
    const colon = raw.indexOf(":");
    if (colon !== -1) {
      result.headers.push({ key: raw.slice(0, colon).trim(), value: raw.slice(colon + 1).trim() });
    }
  }

  // Body
  const bodyMatch = input.match(
    /(?:--data(?:-raw)?|-d)\s+'([^']+)'|(?:--data(?:-raw)?|-d)\s+"([^"]+)"/,
  );
  if (bodyMatch) result.body = bodyMatch[1] ?? bodyMatch[2] ?? "";

  // Auth (-u user:pass)
  const authMatch = input.match(/-u\s+'([^']+)'|-u\s+"([^"]+)"|-u\s+(\S+)/);
  if (authMatch) result.auth = authMatch[1] ?? authMatch[2] ?? authMatch[3] ?? "";

  // Flags
  if (/-L\b/.test(input)) result.flags.push("-L (follow redirects)");
  if (/-v\b/.test(input)) result.flags.push("-v (verbose)");
  if (/-s\b/.test(input)) result.flags.push("-s (silent)");
  if (/-i\b/.test(input)) result.flags.push("-i (include response headers)");

  return result;
}

export default function CurlBuilderPage() {
  const [mode, setMode] = useState<Mode>("build");

  // Build mode state
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://api.example.com/users");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [params, setParams] = useState<Param[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authValue, setAuthValue] = useState("");
  const [followRedirects, setFollowRedirects] = useState(false);
  const [verbose, setVerbose] = useState(false);

  // Parse mode state
  const [rawCurl, setRawCurl] = useState("");

  const generatedCurl = useMemo(
    () =>
      buildCurl(method, url, headers, params, body, authType, authValue, followRedirects, verbose),
    [authType, authValue, body, followRedirects, headers, method, params, url, verbose],
  );

  const parsedResult = useMemo(() => (rawCurl.trim() ? parseCurl(rawCurl) : null), [rawCurl]);

  function addHeader() {
    setHeaders([...headers, { key: "", value: "" }]);
  }
  function removeHeader(i: number) {
    setHeaders(headers.filter((_, idx) => idx !== i));
  }
  function updateHeader(i: number, field: "key" | "value", val: string) {
    setHeaders(headers.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));
  }

  function addParam() {
    setParams([...params, { key: "", value: "" }]);
  }
  function removeParam(i: number) {
    setParams(params.filter((_, idx) => idx !== i));
  }
  function updateParam(i: number, field: "key" | "value", val: string) {
    setParams(params.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }

  const tool = internalTools.find((t) => t.slug === "curl-builder");

  return (
    <ToolLayout tool={tool}>
      {/* Mode toggle */}
      <div className="mb-6 flex gap-2">
        {(["build", "parse"] as Mode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m)}
            className="font-semibold capitalize"
          >
            {m} Mode
          </Button>
        ))}
      </div>

      {mode === "build" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Method + URL */}
            <div className="flex gap-2">
              <SelectField
                label="Method"
                value={method}
                onValueChange={(v) => v && setMethod(v as HttpMethod)}
                options={METHODS.map((m) => ({ label: m, value: m }))}
              />
              <div className="flex-1 space-y-2">
                <Label>URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />
              </div>
            </div>

            {/* Auth */}
            <div className="space-y-3">
              <SelectField
                label="Authentication"
                value={authType}
                onValueChange={(v) => v && setAuthType(v as AuthType)}
                options={AUTH_TYPES.map((type) => type)}
              />
              {authType !== "none" && (
                <Input
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                  placeholder={
                    authType === "bearer"
                      ? "your-token"
                      : authType === "basic"
                        ? "username:password"
                        : "your-api-key"
                  }
                  className="font-mono"
                />
              )}
            </div>

            {/* Headers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Headers
                </Label>
                <Button variant="outline" size="sm" onClick={addHeader}>
                  <PlusIcon weight="duotone" className="size-3.5" /> Add
                </Button>
              </div>
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={h.key}
                    onChange={(e) => updateHeader(i, "key", e.target.value)}
                    placeholder="Key"
                    className="flex-1 font-mono text-xs"
                  />
                  <Input
                    value={h.value}
                    onChange={(e) => updateHeader(i, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeHeader(i)}
                    className="shrink-0"
                  >
                    <TrashIcon weight="duotone" className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Query Params */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Query Params
                </Label>
                <Button variant="outline" size="sm" onClick={addParam}>
                  <PlusIcon weight="duotone" className="size-3.5" /> Add
                </Button>
              </div>
              {params.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={p.key}
                    onChange={(e) => updateParam(i, "key", e.target.value)}
                    placeholder="Key"
                    className="flex-1 font-mono text-xs"
                  />
                  <Input
                    value={p.value}
                    onChange={(e) => updateParam(i, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeParam(i)}
                    className="shrink-0"
                  >
                    <TrashIcon weight="duotone" className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <TextareaGroup
                label="Request Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "key": "value" }'
              />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6">
              <CheckboxField
                label="Follow redirects (-L)"
                checked={followRedirects}
                onCheckedChange={(checked) => setFollowRedirects(checked === true)}
              />
              <CheckboxField
                label="Verbose (-v)"
                checked={verbose}
                onCheckedChange={(checked) => setVerbose(checked === true)}
              />
            </div>
          </div>

          <TextareaGroup
            label="Generated curl Command"
            readOnly
            value={generatedCurl}
            className="h-full"
            action={<CopyButton iconOnly textToCopy={generatedCurl} disabled={!generatedCurl} />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — Raw input */}
          <div className="space-y-4">
            <TextareaGroup
              label="Paste curl Command"
              value={rawCurl}
              onChange={(e) => setRawCurl(e.target.value)}
              placeholder={`curl -X POST 'https://api.example.com/users' \\\n  -H 'Authorization: Bearer token' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"name":"Alice"}'`}
              action={<ClearButton size="sm" onClick={() => setRawCurl("")} disabled={!rawCurl} />}
            />
          </div>

          {/* Right — Parsed breakdown */}
          <div className="space-y-4">
            {parsedResult ? (
              <>
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                      Request
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 font-mono text-xs font-bold">
                          {parsedResult.method}
                        </span>
                        <span className="text-foreground font-mono text-sm break-all">
                          {parsedResult.url || "—"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {parsedResult.headers.length > 0 && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                        Headers ({parsedResult.headers.length})
                      </p>
                      <div className="space-y-1.5">
                        {parsedResult.headers.map((h, i) => (
                          <div key={i} className="flex items-baseline justify-between gap-2">
                            <span className="text-foreground font-mono text-xs font-semibold">
                              {h.key}
                            </span>
                            <span className="text-muted-foreground truncate font-mono text-xs">
                              {h.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.body && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                        Body
                      </p>
                      <pre className="text-foreground font-mono text-xs break-all whitespace-pre-wrap">
                        {parsedResult.body}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.auth && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                        Auth (-u)
                      </p>
                      <p className="text-foreground font-mono text-sm">{parsedResult.auth}</p>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.flags.length > 0 && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                        Flags
                      </p>
                      <div className="space-y-1">
                        {parsedResult.flags.map((f) => (
                          <p key={f} className="text-foreground font-mono text-sm">
                            {f}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Paste a curl command to see the breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
