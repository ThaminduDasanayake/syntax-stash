"use client";

import {
  ArrowSquareOutIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";

import type { ExtractedData } from "@/app/api/extract/route";
import { HeadingGroup } from "@/app/tools/web-extractor/heading-group";
import { MetaRow } from "@/app/tools/web-extractor/meta-row";
import { Section } from "@/app/tools/web-extractor/section";
import { ErrorAlert } from "@/components/error-alert";
import { EmptyState } from "@/components/plate-ui/empty-state";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
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

  const rawJSON = data ? JSON.stringify(data, null, 2) : "";
  const totalLinks = data?.anchors.length ?? 0;
  const totalHeadings =
    (data?.headings.h1.length ?? 0) +
    (data?.headings.h2.length ?? 0) +
    (data?.headings.h3.length ?? 0);

  const tool = internalTools.find((t) => t.slug === "web-extractor");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleExtract();
          }}
          className="mx-auto w-full max-w-2xl shrink-0 space-y-4"
        >
          <InputField
            ref={inputRef}
            label="Target URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            suffix={
              <ClearButton
                type="button"
                iconOnly
                onClick={() => {
                  setUrl("");
                  setData(null);
                  setError(null);
                }}
                disabled={loading || (!url && !data)}
              />
            }
          />

          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? (
              <>
                <SpinnerGapIcon weight="bold" className="animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon weight="bold" />
                Extract Data
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mx-auto w-full max-w-2xl shrink-0">
            <ErrorAlert message={error} />
          </div>
        )}

        {!data && !loading && !error && (
          <EmptyState
            title="Awaiting Target URL"
            description="Enter a website address above to extract its SEO metadata, headings, and links."
          />
        )}

        {loading && (
          <div className="border-border bg-card mx-auto flex w-full max-w-2xl flex-col items-center justify-center border border-dashed py-16 text-center">
            <SpinnerGapIcon size={32} className="text-primary mb-4 animate-spin" />
            <p className="text-sm font-semibold">Parsing Website...</p>
            <p className="text-muted-foreground mt-1 max-w-[80%] truncate font-mono text-xs">
              {url}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {data && (
          <div className="flex flex-col gap-6">
            {/* Visual Data */}
            <div className="flex flex-col gap-6">
              {/* Page Link Banner */}
              <div className="border-border bg-card flex items-center gap-3 border px-4 py-3">
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
                  <MetaRow label="Author" value={data.author} />
                  <MetaRow label="Keywords" value={data.keywords?.join(", ") ?? ""} />
                  <MetaRow label="Canonical" value={data.canonicalUrl} />

                  {/* Basic page setup */}
                  <MetaRow label="Charset" value={data.charset} />
                  <MetaRow label="Lang" value={data.language} />
                  <MetaRow label="Viewport" value={data.viewport} />
                  <MetaRow label="Generator" value={data.generator} />

                  {/* Robots directives */}
                  <MetaRow label="Robots" value={data.robots?.robots} />
                  <MetaRow label="Googlebot" value={data.robots?.googlebot} />
                  <MetaRow label="Bingbot" value={data.robots?.bingbot} />

                  {/* Design/Theme */}
                  <MetaRow label="Theme Color" value={data.themeColor?.themeColor} />
                  <MetaRow label="Color Scheme" value={data.themeColor?.colorScheme} />

                  {/* Open Graph extensions */}
                  <MetaRow label="OG Title" value={data.openGraph?.title} />
                  <MetaRow label="OG Desc." value={data.openGraph?.description} />
                  <MetaRow label="OG Image" value={data.openGraph?.image} />
                  <MetaRow label="OG Type" value={data.openGraph?.type} />
                  <MetaRow label="OG Site" value={data.openGraph?.siteName} />
                  <MetaRow label="OG Locale" value={data.openGraph?.locale} />
                  <MetaRow
                    label="OG Locale Alt"
                    value={data.openGraph?.localeAlternate?.join(", ") ?? ""}
                  />

                  {/* Twitter Cards */}
                  <MetaRow label="Twitter Title" value={data.twitter?.title} />
                  <MetaRow label="Twitter Desc." value={data.twitter?.description} />
                  <MetaRow label="Twitter Card" value={data.twitter?.card} />
                  <MetaRow label="Twitter Image" value={data.twitter?.image} />
                  <MetaRow label="Twitter Site" value={data.twitter?.site} />
                  <MetaRow label="Twitter Creator" value={data.twitter?.creator} />

                  {/* Verification */}
                  <MetaRow label="Google Verify" value={data.verification?.google} />
                  <MetaRow label="Bing Verify" value={data.verification?.bing} />
                  <MetaRow label="Pinterest Verify" value={data.verification?.pinterest} />
                  <MetaRow label="Yandex Verify" value={data.verification?.yandex} />
                  <MetaRow label="Facebook Verify" value={data.verification?.facebook} />

                  {/* Security meta headers */}
                  <MetaRow label="CSP" value={data.securityHeaders?.contentSecurityPolicy} />
                  <MetaRow label="Refresh" value={data.securityHeaders?.refresh} />
                  <MetaRow label="X-UA-Compatible" value={data.securityHeaders?.xUaCompatible} />
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
                    {data?.anchors.map((href, i) => (
                      <li
                        key={i}
                        className="hover:bg-muted/50 flex items-start gap-2 p-1.5 transition-colors"
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

            <TextareaGroup
              autoGrow
              className="break-all whitespace-pre-wrap"
              label="Raw JSON Response"
              value={rawJSON}
              readOnly
              action={<CopyButton iconOnly textToCopy={rawJSON} disabled={!rawJSON} />}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
