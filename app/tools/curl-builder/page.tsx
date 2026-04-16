"use client";

import { Check, Copy, Plus, Terminal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

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

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

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
  headers.filter((h) => h.key).forEach((h) => {
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
    const qs = queryParts.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
  }

  parts.push(`'${fullUrl}'`);

  // Break long commands
  return parts.join(" \\\n  ");
}

function parseCurl(raw: string): ParsedCurl {
  const result: ParsedCurl = { method: "GET", url: "", headers: [], body: "", auth: "", flags: [] };

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
  const bodyMatch = input.match(/(?:--data(?:-raw)?|-d)\s+'([^']+)'|(?:--data(?:-raw)?|-d)\s+"([^"]+)"/);
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
  const [headers, setHeaders] = useState<Header[]>([{ key: "Content-Type", value: "application/json" }]);
  const [params, setParams] = useState<Param[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authValue, setAuthValue] = useState("");
  const [followRedirects, setFollowRedirects] = useState(false);
  const [verbose, setVerbose] = useState(false);

  // Parse mode state
  const [rawCurl, setRawCurl] = useState("");

  const { copied: copiedBuild, copy: copyBuild } = useCopyToClipboard();
  const { copied: copiedParse, copy: copyParse } = useCopyToClipboard();

  const generatedCurl = useMemo(
    () => buildCurl(method, url, headers, params, body, authType, authValue, followRedirects, verbose),
    [method, url, headers, params, body, authType, authValue, followRedirects, verbose],
  );

  const parsedResult = useMemo(() => (rawCurl.trim() ? parseCurl(rawCurl) : null), [rawCurl]);

  function addHeader() { setHeaders([...headers, { key: "", value: "" }]); }
  function removeHeader(i: number) { setHeaders(headers.filter((_, idx) => idx !== i)); }
  function updateHeader(i: number, field: "key" | "value", val: string) {
    setHeaders(headers.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));
  }

  function addParam() { setParams([...params, { key: "", value: "" }]); }
  function removeParam(i: number) { setParams(params.filter((_, idx) => idx !== i)); }
  function updateParam(i: number, field: "key" | "value", val: string) {
    setParams(params.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }

  return (
    <ToolLayout
      icon={Terminal}
      title="curl Command"
      highlight="Builder"
      description="Build curl commands from form inputs, or paste a curl command to parse it into a visual breakdown."
    >
      {/* Mode toggle */}
      <div className="mb-6 flex gap-2">
        {(["build", "parse"] as Mode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m)}
            className="rounded-full font-semibold capitalize"
          >
            {m} Mode
          </Button>
        ))}
      </div>

      {mode === "build" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — Inputs */}
          <div className="space-y-6">
            {/* Method + URL */}
            <div className="flex gap-2">
              <div className="w-36 space-y-2">
                <Label>Method</Label>
                <Select value={method} onValueChange={(v) => v && setMethod(v as HttpMethod)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />
              </div>
            </div>

            {/* Auth */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Authentication</Label>
              <Select value={authType} onValueChange={(v) => v && setAuthType(v as AuthType)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth (user:pass)</SelectItem>
                  <SelectItem value="api-key">API Key Header</SelectItem>
                </SelectContent>
              </Select>
              {authType !== "none" && (
                <Input
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                  placeholder={
                    authType === "bearer" ? "your-token" :
                    authType === "basic" ? "username:password" :
                    "your-api-key"
                  }
                  className="font-mono"
                />
              )}
            </div>

            {/* Headers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Headers</Label>
                <Button variant="outline" size="sm" onClick={addHeader} className="rounded-full">
                  <Plus size={12} /> Add
                </Button>
              </div>
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={h.key} onChange={(e) => updateHeader(i, "key", e.target.value)} placeholder="Key" className="flex-1 font-mono text-xs" />
                  <Input value={h.value} onChange={(e) => updateHeader(i, "value", e.target.value)} placeholder="Value" className="flex-1 font-mono text-xs" />
                  <Button variant="outline" size="sm" onClick={() => removeHeader(i)} className="shrink-0 rounded-full">
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Query Params */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Query Params</Label>
                <Button variant="outline" size="sm" onClick={addParam} className="rounded-full">
                  <Plus size={12} /> Add
                </Button>
              </div>
              {params.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={p.key} onChange={(e) => updateParam(i, "key", e.target.value)} placeholder="Key" className="flex-1 font-mono text-xs" />
                  <Input value={p.value} onChange={(e) => updateParam(i, "value", e.target.value)} placeholder="Value" className="flex-1 font-mono text-xs" />
                  <Button variant="outline" size="sm" onClick={() => removeParam(i)} className="shrink-0 rounded-full">
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label>Request Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder='{ "key": "value" }' className="font-mono text-xs" />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={followRedirects} onChange={(e) => setFollowRedirects(e.target.checked)} className="accent-primary" />
                <span>Follow redirects (-L)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="accent-primary" />
                <span>Verbose (-v)</span>
              </label>
            </div>
          </div>

          {/* Right — Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated curl Command</Label>
              <Button variant="outline" size="sm" onClick={() => copyBuild(generatedCurl)} className="rounded-full font-semibold">
                {copiedBuild ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </Button>
            </div>
            <Textarea readOnly value={generatedCurl} rows={16} className="font-mono text-xs" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left — Raw input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Paste curl Command</Label>
              <Textarea
                value={rawCurl}
                onChange={(e) => setRawCurl(e.target.value)}
                rows={16}
                placeholder={`curl -X POST 'https://api.example.com/users' \\\n  -H 'Authorization: Bearer token' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"name":"Alice"}'`}
                className="font-mono text-xs"
              />
            </div>
            {parsedResult && (
              <Button variant="outline" size="sm" onClick={() => copyParse(rawCurl)} className="rounded-full font-semibold">
                {copiedParse ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Raw</>}
              </Button>
            )}
          </div>

          {/* Right — Parsed breakdown */}
          <div className="space-y-4">
            {parsedResult ? (
              <>
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">Request</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 font-mono text-xs font-bold">{parsedResult.method}</span>
                        <span className="text-foreground break-all font-mono text-sm">{parsedResult.url || "—"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {parsedResult.headers.length > 0 && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">Headers ({parsedResult.headers.length})</p>
                      <div className="space-y-1.5">
                        {parsedResult.headers.map((h, i) => (
                          <div key={i} className="flex items-baseline justify-between gap-2">
                            <span className="text-foreground font-mono text-xs font-semibold">{h.key}</span>
                            <span className="text-muted-foreground truncate font-mono text-xs">{h.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.body && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Body</p>
                      <pre className="text-foreground whitespace-pre-wrap break-all font-mono text-xs">{parsedResult.body}</pre>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.auth && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Auth (-u)</p>
                      <p className="text-foreground font-mono text-sm">{parsedResult.auth}</p>
                    </CardContent>
                  </Card>
                )}

                {parsedResult.flags.length > 0 && (
                  <Card>
                    <CardContent>
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Flags</p>
                      <div className="space-y-1">
                        {parsedResult.flags.map((f) => (
                          <p key={f} className="text-foreground font-mono text-sm">{f}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="border-border flex min-h-60 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">Paste a curl command to see the breakdown.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
