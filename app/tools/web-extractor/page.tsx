"use client";

import { ChevronDown, ExternalLink, Globe, Loader2, Search, Tag } from "lucide-react";
import { useRef, useState } from "react";

import type { ExtractedData } from "@/app/api/extract/route";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ---------------------------------------------------------------------------
// Section — collapsible card used for each data group
// ---------------------------------------------------------------------------

interface SectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, count, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{title}</span>
            {count !== undefined && (
              <Badge variant="secondary" className="font-mono text-[11px]">
                {count}
              </Badge>
            )}
          </div>
          <ChevronDown
            size={15}
            className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="border-t px-5 pb-5 pt-4">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ---------------------------------------------------------------------------
// MetaRow — single key → value row inside SEO section
// ---------------------------------------------------------------------------

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm [&:not(:last-child)]:border-b">
      <span className="shrink-0 font-medium text-muted-foreground">{label}</span>
      <span className="break-all">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeadingRow — H1 / H2 / H3 group
// ---------------------------------------------------------------------------

function HeadingGroup({
  level,
  items,
}: {
  level: "h1" | "h2" | "h3";
  items: string[];
}) {
  if (items.length === 0) return null;
  const colors = {
    h1: "text-foreground font-semibold text-base",
    h2: "text-foreground/80 font-medium text-sm",
    h3: "text-muted-foreground text-sm",
  } as const;
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {level} · {items.length}
      </p>
      <ul className="space-y-1">
        {items.map((text, i) => (
          <li key={i} className={`${colors[level]} truncate`} title={text}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Tag size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">No data yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Enter a URL and click Extract to see results
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WebExtractorPage() {
  const [url, setUrl]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [data, setData]     = useState<ExtractedData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleExtract() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/extract?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? `Server error: ${res.status}`);
        return;
      }

      setData(json as ExtractedData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleExtract();
  }

  const rawJSON = data ? JSON.stringify(data, null, 2) : "";
  const totalLinks = data?.links.length ?? 0;
  const totalHeadings =
    (data?.headings.h1.length ?? 0) +
    (data?.headings.h2.length ?? 0) +
    (data?.headings.h3.length ?? 0);

  return (
    <ToolLayout
      icon={Globe}
      title="Web"
      highlight="Extractor"
      description="Extract meta tags, headings, and links from any public URL."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left — URL input                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Target URL</Label>
            <Input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="font-mono text-sm"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              onClick={handleExtract}
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Extracting…
                </>
              ) : (
                <>
                  <Search size={15} />
                  Extract Data
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUrl("");
                setData(null);
                setError(null);
                inputRef.current?.focus();
              }}
              disabled={loading || (!url && !data)}
            >
              Clear
            </Button>
          </div>

          {error && <ErrorAlert message={error} />}

          {/* Raw JSON output lives in the left column on mobile but we
              render it here as a secondary panel */}
          {data && (
            <TextAreaField
              label="Raw JSON"
              value={rawJSON}
              readOnly
              rows={12}
              action={
                <CopyButton value={rawJSON} disabled={!rawJSON} />
              }
            />
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right — structured results                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-3">
          {!data && !loading && <EmptyState />}

          {loading && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <Loader2 size={32} className="mb-3 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching and parsing…</p>
              <p className="mt-1 text-xs text-muted-foreground">{url}</p>
            </div>
          )}

          {data && (
            <>
              {/* Page info strip */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Globe size={13} className="shrink-0 text-muted-foreground" />
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-mono text-xs text-primary hover:underline"
                >
                  {data.url}
                </a>
                <ExternalLink size={11} className="shrink-0 text-muted-foreground" />
              </div>

              {/* SEO Meta */}
              <Section title="SEO & Open Graph">
                <div className="divide-y">
                  <MetaRow label="Title"        value={data.title} />
                  <MetaRow label="Description"  value={data.description} />
                  <MetaRow label="OG Title"     value={data.openGraph.title} />
                  <MetaRow label="OG Desc."     value={data.openGraph.description} />
                  <MetaRow label="OG Image"     value={data.openGraph.image} />
                  <MetaRow label="OG Type"      value={data.openGraph.type} />
                  <MetaRow label="OG Site"      value={data.openGraph.siteName} />
                </div>
                {!data.title && !data.description && !data.openGraph.title && (
                  <p className="text-xs text-muted-foreground">No meta tags found.</p>
                )}
              </Section>

              {/* Headings */}
              <Section title="Headings" count={totalHeadings}>
                {totalHeadings === 0 ? (
                  <p className="text-xs text-muted-foreground">No headings found.</p>
                ) : (
                  <div className="space-y-4">
                    <HeadingGroup level="h1" items={data.headings.h1} />
                    <HeadingGroup level="h2" items={data.headings.h2} />
                    <HeadingGroup level="h3" items={data.headings.h3} />
                  </div>
                )}
              </Section>

              {/* Links */}
              <Section title="Links" count={totalLinks} defaultOpen={false}>
                {totalLinks === 0 ? (
                  <p className="text-xs text-muted-foreground">No links found.</p>
                ) : (
                  <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                    {data.links.map((href, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <ExternalLink
                          size={11}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                        />
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-primary hover:underline"
                          title={href}
                        >
                          {href}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
