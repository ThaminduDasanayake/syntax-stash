"use client";

import {
  ArrowSquareOutIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { KeyboardEvent, useRef, useState } from "react";

import type { ExtractedData } from "@/app/api/extract/route";
import { HeadingGroup } from "@/app/tools/web-extractor/heading-group";
import { MetaRow } from "@/app/tools/web-extractor/meta-row";
import { Section } from "@/app/tools/web-extractor/section";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

export default function WebExtractorPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData | null>(null);
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

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleExtract();
  }

  const rawJSON = data ? JSON.stringify(data, null, 2) : "";
  const totalLinks = data?.links.length ?? 0;
  const totalHeadings =
    (data?.headings.h1.length ?? 0) +
    (data?.headings.h2.length ?? 0) +
    (data?.headings.h3.length ?? 0);

  const tool = internalTools.find((t) => t.url === "/tools/web-extractor");

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col gap-8">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          <InputField
            ref={inputRef}
            label="Target URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="font-mono text-sm"
            disabled={loading}
          />

          <div className="flex gap-3">
            <Button
              className="flex-1 font-medium"
              onClick={handleExtract}
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <SpinnerGapIcon className="mr-2 size-4.5 animate-spin" />
              ) : (
                <MagnifyingGlassIcon weight="bold" className="mr-2 size-4.5" />
              )}
              {loading ? "Extracting..." : "Extract Data"}
            </Button>
            <ClearButton
              onClick={() => {
                setUrl("");
                setData(null);
                setError(null);
                inputRef.current?.focus();
              }}
              disabled={loading || (!url && !data)}
            />
          </div>

          {error && <ErrorAlert message={error} />}
        </div>

        {!data && !loading && !error && (
          <EmptyState
            title="Awaiting Target URL"
            description="Enter a website address above to extract its SEO metadata, headings, and links."
          />
        )}

        {loading && (
          <div className="border-border bg-card mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center shadow-sm">
            <SpinnerGapIcon size={32} className="text-primary mb-4 animate-spin" />
            <p className="text-sm font-semibold">Parsing Website...</p>
            <p className="text-muted-foreground mt-1 max-w-[80%] truncate font-mono text-xs">
              {url}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {data && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]">
            {/* Visual Data */}
            <div className="flex flex-col gap-6">
              {/* Page Link Banner */}
              <div className="border-border bg-card flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm">
                <GlobeIcon size={20} className="text-primary shrink-0" />
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground truncate font-mono text-sm font-medium hover:underline"
                >
                  {data.url}
                </a>
                <ArrowSquareOutIcon
                  weight="duotone"
                  size={16}
                  className="text-muted-foreground ml-auto shrink-0"
                />
              </div>

              {/* Data Sections */}
              <Section title="SEO & Open Graph">
                <div className="flex flex-col">
                  <MetaRow label="Title" value={data.title} />
                  <MetaRow label="Description" value={data.description} />
                  <MetaRow label="OG Title" value={data.openGraph.title} />
                  <MetaRow label="OG Desc." value={data.openGraph.description} />
                  <MetaRow label="OG Image" value={data.openGraph.image} />
                  <MetaRow label="OG Type" value={data.openGraph.type} />
                  <MetaRow label="OG Site" value={data.openGraph.siteName} />
                </div>
                {!data.title && !data.description && !data.openGraph.title && (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No meta tags found on this page.
                  </p>
                )}
              </Section>

              <Section title="Page Headings" count={totalHeadings}>
                {totalHeadings === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No headings (H1-H3) found.
                  </p>
                ) : (
                  <div className="space-y-4 pt-1">
                    <HeadingGroup level="h1" items={data.headings.h1} />
                    <HeadingGroup level="h2" items={data.headings.h2} />
                    <HeadingGroup level="h3" items={data.headings.h3} />
                  </div>
                )}
              </Section>

              <Section title="Extracted Links" count={totalLinks} defaultOpen={false}>
                {totalLinks === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">No links found.</p>
                ) : (
                  <ul className="flex flex-col gap-2 pt-1">
                    {data?.links.map((href, i) => (
                      <li
                        key={i}
                        className="hover:bg-muted/50 flex items-start gap-2 rounded-md p-1.5 transition-colors"
                      >
                        <ArrowSquareOutIcon
                          weight="duotone"
                          size={15}
                          className="text-muted-foreground mt-0.5 shrink-0"
                        />
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm break-all hover:underline"
                        >
                          {href}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>

            <div className="relative">
              <div className="sticky top-6">
                <TextAreaField
                  label="Raw JSON Response"
                  value={rawJSON}
                  readOnly
                  rows={28}
                  className="font-mono text-xs"
                  action={<CopyButton value={rawJSON} disabled={!rawJSON} />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
