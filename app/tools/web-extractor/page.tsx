"use client";

import {
  ArrowSquareOutIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";

import { MetaRow } from "@/app/tools/web-extractor/meta-row";
import { Section } from "@/app/tools/web-extractor/section";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { InputField } from "@/components/ui/input-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function WebExtractorPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headHtml, setHeadHtml] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  interface ExtractedMetadata {
    url: string;
    title: string | null;
    description: string | null;
    author: string | null;
    keywords: string[];
    canonicalUrl: string | null;
    charset: string | null;
    language: string | null;
    viewport: string | null;
    generator: string | null;
    robots: {
      robots: string | null;
      googlebot: string | null;
      bingbot: string | null;
    };
    themeColor: {
      themeColor: string | null;
      colorScheme: string | null;
    };
    openGraph: {
      title: string | null;
      description: string | null;
      image: string | null;
      type: string | null;
      siteName: string | null;
      locale: string | null;
      localeAlternate: string[];
    };
    twitter: {
      title: string | null;
      description: string | null;
      card: string | null;
      image: string | null;
      site: string | null;
      creator: string | null;
    };
    verification: {
      google: string | null;
      bing: string | null;
      pinterest: string | null;
      yandex: string | null;
      facebook: string | null;
    };
    securityHeaders: {
      contentSecurityPolicy: string | null;
      refresh: string | null;
      xUaCompatible: string | null;
    };
  }

  async function handleExtract() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setHeadHtml(null);
    setMetadata(null);

    try {
      const res = await fetch("/api/scrape-head", {
        body: JSON.stringify({ targetUrl: trimmed }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? `Server error: ${res.status}`);
        return;
      }

      setHeadHtml(json.head);
      setMetadata(json.metadata);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
                  setHeadHtml(null);
                  setMetadata(null);
                  setError(null);
                }}
                disabled={loading || (!url && !headHtml)}
              />
            }
          />

          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? (
              <>
                <SpinnerGapIcon weight="bold" className="animate-spin" />
                Extracting Head Tag...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon weight="bold" />
                Extract Head Tag
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mx-auto w-full max-w-2xl shrink-0">
            <ErrorAlert message={error} />
          </div>
        )}

        {!headHtml && !loading && !error && (
          <EmptyState
            title="Awaiting Target URL"
            description="Enter a website address above to fetch its exact <head> HTML content via ScrapingBee."
          />
        )}

        {loading && (
          <div className="border-border bg-card mx-auto flex w-full max-w-2xl flex-col items-center justify-center border border-dashed py-16 text-center">
            <SpinnerGapIcon size={32} className="text-primary mb-4 animate-spin" />
            <p className="text-sm font-semibold">Fetching Head Tag HTML...</p>
            <p className="text-muted-foreground mt-1 max-w-[80%] truncate font-mono text-xs">
              {url}
            </p>
          </div>
        )}

        {/* Results */}
        {metadata && headHtml && (
          <div className="flex flex-col gap-6">
            {/* Page Link Banner */}
            <div className="border-border bg-card flex items-center gap-3 border px-4 py-3">
              <GlobeIcon size={20} className="text-primary shrink-0" />
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground truncate font-mono text-sm font-medium hover:underline"
              >
                {metadata.url}
              </a>
              <ArrowSquareOutIcon
                weight="duotone"
                size={16}
                className="text-muted-foreground ml-auto shrink-0"
              />
            </div>

            {/* Extracted Metadata Rows */}
            <Section title="SEO & Open Graph">
              <div className="flex flex-col">
                <MetaRow label="Title" value={metadata.title} />
                <MetaRow label="Description" value={metadata.description} />
                <MetaRow label="Author" value={metadata.author} />
                <MetaRow label="Keywords" value={metadata.keywords.join(", ")} />
                <MetaRow label="Canonical" value={metadata.canonicalUrl} />

                {/* Page setup */}
                <MetaRow label="Charset" value={metadata.charset} />
                <MetaRow label="Lang" value={metadata.language} />
                <MetaRow label="Viewport" value={metadata.viewport} />
                <MetaRow label="Generator" value={metadata.generator} />

                {/* Robots directives */}
                <MetaRow label="Robots" value={metadata.robots.robots} />
                <MetaRow label="Googlebot" value={metadata.robots.googlebot} />
                <MetaRow label="Bingbot" value={metadata.robots.bingbot} />

                {/* Theme */}
                <MetaRow label="Theme Color" value={metadata.themeColor.themeColor} />
                <MetaRow label="Color Scheme" value={metadata.themeColor.colorScheme} />

                {/* Open Graph */}
                <MetaRow label="OG Title" value={metadata.openGraph.title} />
                <MetaRow label="OG Desc." value={metadata.openGraph.description} />
                <MetaRow label="OG Image" value={metadata.openGraph.image} />
                <MetaRow label="OG Type" value={metadata.openGraph.type} />
                <MetaRow label="OG Site" value={metadata.openGraph.siteName} />
                <MetaRow label="OG Locale" value={metadata.openGraph.locale} />
                <MetaRow
                  label="OG Locale Alt"
                  value={metadata.openGraph.localeAlternate.join(", ")}
                />

                {/* Twitter Cards */}
                <MetaRow label="Twitter Title" value={metadata.twitter.title} />
                <MetaRow label="Twitter Desc." value={metadata.twitter.description} />
                <MetaRow label="Twitter Card" value={metadata.twitter.card} />
                <MetaRow label="Twitter Image" value={metadata.twitter.image} />
                <MetaRow label="Twitter Site" value={metadata.twitter.site} />
                <MetaRow label="Twitter Creator" value={metadata.twitter.creator} />

                {/* Verification */}
                <MetaRow label="Google Verify" value={metadata.verification.google} />
                <MetaRow label="Bing Verify" value={metadata.verification.bing} />
                <MetaRow label="Pinterest Verify" value={metadata.verification.pinterest} />
                <MetaRow label="Yandex Verify" value={metadata.verification.yandex} />
                <MetaRow label="Facebook Verify" value={metadata.verification.facebook} />

                {/* Security */}
                <MetaRow label="CSP" value={metadata.securityHeaders.contentSecurityPolicy} />
                <MetaRow label="Refresh" value={metadata.securityHeaders.refresh} />
                <MetaRow label="X-UA-Compatible" value={metadata.securityHeaders.xUaCompatible} />
              </div>
            </Section>

            {/* Raw HTML Fallback */}
            <Section title="Extracted <head> Tag">
              <TextareaGroup
                autoGrow
                className="font-mono text-xs break-all whitespace-pre-wrap"
                label="HTML Output"
                value={headHtml}
                readOnly
                action={<CopyButton iconOnly textToCopy={headHtml} disabled={!headHtml} />}
              />
            </Section>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

{
  /*        /!* Results Grid *!/*/
}
{
  /*        {headHtml && (*/
}
{
  /*          <div className="flex flex-col gap-6">*/
}
{
  /*            /!* Visual Data *!/*/
}
{
  /*            /!*<div className="flex flex-col gap-6">*!/*/
}
{
  /*            /!*  /!* Page Link Banner *!/*!/*/
}
{
  /*            /!*  <div className="border-border bg-card flex items-center gap-3 border px-4 py-3">*!/*/
}
{
  /*            /!*    <GlobeIcon size={20} className="text-primary shrink-0" />*!/*/
}
{
  /*            /!*    <a*!/*/
}
{
  /*            /!*      href={data.url}*!/*/
}
{
  /*            /!*      target="_blank"*!/*/
}
{
  /*            /!*      rel="noopener noreferrer"*!/*/
}
{
  /*            /!*      className="text-foreground truncate font-mono text-sm font-medium hover:underline"*!/*/
}
{
  /*            /!*    >*!/*/
}
{
  /*            /!*      {data.url}*!/*/
}
{
  /*            /!*    </a>*!/*/
}
{
  /*            /!*    <ArrowSquareOutIcon*!/*/
}
{
  /*            /!*      weight="duotone"*!/*/
}
{
  /*            /!*      size={16}*!/*/
}
{
  /*            /!*      className="text-muted-foreground ml-auto shrink-0"*!/*/
}
{
  /*            /!*    />*!/*/
}
{
  /*            /!*  </div>*!/*/
}

{
  /*            /!*  /!* Data Sections *!/*!/*/
}
{
  /*            /!*  <Section title="SEO & Open Graph">*!/*/
}
{
  /*            /!*    <div className="flex flex-col">*!/*/
}
{
  /*            /!*      <MetaRow label="Title" value={data.title} />*!/*/
}
{
  /*            /!*      <MetaRow label="Description" value={data.description} />*!/*/
}
{
  /*            /!*      <MetaRow label="Author" value={data.author} />*!/*/
}
{
  /*            /!*      <MetaRow label="Keywords" value={data.keywords?.join(", ") ?? ""} />*!/*/
}
{
  /*            /!*      <MetaRow label="Canonical" value={data.canonicalUrl} />*!/*/
}

{
  /*            /!*      /!* Basic page setup *!/*!/*/
}
{
  /*            /!*      <MetaRow label="Charset" value={data.charset} />*!/*/
}
{
  /*            /!*      <MetaRow label="Lang" value={data.language} />*!/*/
}
{
  /*            /!*      <MetaRow label="Viewport" value={data.viewport} />*!/*/
}
{
  /*            /!*      <MetaRow label="Generator" value={data.generator} />*!/*/
}

{
  /*            /!*      /!* Robots directives *!/*!/*/
}
{
  /*            /!*      <MetaRow label="Robots" value={data.robots?.robots} />*!/*/
}
{
  /*            /!*      <MetaRow label="Googlebot" value={data.robots?.googlebot} />*!/*/
}
{
  /*            /!*      <MetaRow label="Bingbot" value={data.robots?.bingbot} />*!/*/
}

{
  /*            /!*      /!* Design/Theme *!/*!/*/
}
{
  /*            /!*      <MetaRow label="Theme Color" value={data.themeColor?.themeColor} />*!/*/
}
{
  /*            /!*      <MetaRow label="Color Scheme" value={data.themeColor?.colorScheme} />*!/*/
}

{
  /*            /!*      /!* Open Graph extensions *!/*!/*/
}
{
  /*            /!*      <MetaRow label="OG Title" value={data.openGraph?.title} />*!/*/
}
{
  /*            /!*      <MetaRow label="OG Desc." value={data.openGraph?.description} />*!/*/
}
{
  /*            /!*      <MetaRow label="OG Image" value={data.openGraph?.image} />*!/*/
}
{
  /*            /!*      <MetaRow label="OG Type" value={data.openGraph?.type} />*!/*/
}
{
  /*            /!*      <MetaRow label="OG Site" value={data.openGraph?.siteName} />*!/*/
}
{
  /*            /!*      <MetaRow label="OG Locale" value={data.openGraph?.locale} />*!/*/
}
{
  /*            /!*      <MetaRow*!/*/
}
{
  /*            /!*        label="OG Locale Alt"*!/*/
}
{
  /*            /!*        value={data.openGraph?.localeAlternate?.join(", ") ?? ""}*!/*/
}
{
  /*            /!*      />*!/*/
}

{
  /*            /!*      /!* Twitter Cards *!/*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Title" value={data.twitter?.title} />*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Desc." value={data.twitter?.description} />*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Card" value={data.twitter?.card} />*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Image" value={data.twitter?.image} />*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Site" value={data.twitter?.site} />*!/*/
}
{
  /*            /!*      <MetaRow label="Twitter Creator" value={data.twitter?.creator} />*!/*/
}

{
  /*            /!*      /!* Verification *!/*!/*/
}
{
  /*            /!*      <MetaRow label="Google Verify" value={data.verification?.google} />*!/*/
}
{
  /*            /!*      <MetaRow label="Bing Verify" value={data.verification?.bing} />*!/*/
}
{
  /*            /!*      <MetaRow label="Pinterest Verify" value={data.verification?.pinterest} />*!/*/
}
{
  /*            /!*      <MetaRow label="Yandex Verify" value={data.verification?.yandex} />*!/*/
}
{
  /*            /!*      <MetaRow label="Facebook Verify" value={data.verification?.facebook} />*!/*/
}

{
  /*            /!*      /!* Security meta headers *!/*!/*/
}
{
  /*            /!*      <MetaRow label="CSP" value={data.securityHeaders?.contentSecurityPolicy} />*!/*/
}
{
  /*            /!*      <MetaRow label="Refresh" value={data.securityHeaders?.refresh} />*!/*/
}
{
  /*            /!*      <MetaRow label="X-UA-Compatible" value={data.securityHeaders?.xUaCompatible} />*!/*/
}
{
  /*            /!*    </div>*!/*/
}
{
  /*            /!*    {!data.title && !data.description && !data.openGraph.title && (*!/*/
}
{
  /*            /!*      <p className="text-muted-foreground py-4 text-center text-sm">*!/*/
}
{
  /*            /!*        No meta tags found on this page.*!/*/
}
{
  /*            /!*      </p>*!/*/
}
{
  /*            /!*    )}*!/*/
}
{
  /*            /!*  </Section>*!/*/
}

{
  /*            /!*  <Section title="Page Headings" count={totalHeadings}>*!/*/
}
{
  /*            /!*    {totalHeadings === 0 ? (*!/*/
}
{
  /*            /!*      <p className="text-muted-foreground py-4 text-center text-sm">*!/*/
}
{
  /*            /!*        No headings (H1-H3) found.*!/*/
}
{
  /*            /!*      </p>*!/*/
}
{
  /*            /!*    ) : (*!/*/
}
{
  /*            /!*      <div className="space-y-4 pt-1">*!/*/
}
{
  /*            /!*        <HeadingGroup level="h1" items={data.headings.h1} />*!/*/
}
{
  /*            /!*        <HeadingGroup level="h2" items={data.headings.h2} />*!/*/
}
{
  /*            /!*        <HeadingGroup level="h3" items={data.headings.h3} />*!/*/
}
{
  /*            /!*      </div>*!/*/
}
{
  /*            /!*    )}*!/*/
}
{
  /*            /!*  </Section>*!/*/
}

{
  /*            /!*  <Section title="Extracted Links" count={totalLinks} defaultOpen={false}>*!/*/
}
{
  /*            /!*    {totalLinks === 0 ? (*!/*/
}
{
  /*            /!*      <p className="text-muted-foreground py-4 text-center text-sm">No links found.</p>*!/*/
}
{
  /*            /!*    ) : (*!/*/
}
{
  /*            /!*      <ul className="flex flex-col gap-2 pt-1">*!/*/
}
{
  /*            /!*        {data?.anchors.map((href, i) => (*!/*/
}
{
  /*            /!*          <li*!/*/
}
{
  /*            /!*            key={i}*!/*/
}
{
  /*            /!*            className="hover:bg-muted/50 flex items-start gap-2 p-1.5 transition-colors"*!/*/
}
{
  /*            /!*          >*!/*/
}
{
  /*            /!*            <ArrowSquareOutIcon*!/*/
}
{
  /*            /!*              weight="duotone"*!/*/
}
{
  /*            /!*              size={15}*!/*/
}
{
  /*            /!*              className="text-muted-foreground mt-0.5 shrink-0"*!/*/
}
{
  /*            /!*            />*!/*/
}
{
  /*            /!*            <a*!/*/
}
{
  /*            /!*              href={href}*!/*/
}
{
  /*            /!*              target="_blank"*!/*/
}
{
  /*            /!*              rel="noopener noreferrer"*!/*/
}
{
  /*            /!*              className="text-primary text-sm break-all hover:underline"*!/*/
}
{
  /*            /!*            >*!/*/
}
{
  /*            /!*              {href}*!/*/
}
{
  /*            /!*            </a>*!/*/
}
{
  /*            /!*          </li>*!/*/
}
{
  /*            /!*        ))}*!/*/
}
{
  /*            /!*      </ul>*!/*/
}
{
  /*            /!*    )}*!/*/
}
{
  /*            /!*  </Section>*!/*/
}
{
  /*            /!* Page Link Banner *!/*/
}
{
  /*            <div className="border-border bg-card flex items-center gap-3 border px-4 py-3">*/
}
{
  /*              <GlobeIcon size={20} className="text-primary shrink-0" />*/
}
{
  /*              <a*/
}
{
  /*                href={url}*/
}
{
  /*                target="_blank"*/
}
{
  /*                rel="noopener noreferrer"*/
}
{
  /*                className="text-foreground truncate font-mono text-sm font-medium hover:underline"*/
}
{
  /*              >*/
}
{
  /*                {url}*/
}
{
  /*              </a>*/
}
{
  /*              <ArrowSquareOutIcon*/
}
{
  /*                weight="duotone"*/
}
{
  /*                size={16}*/
}
{
  /*                className="text-muted-foreground ml-auto shrink-0"*/
}
{
  /*              />*/
}
{
  /*            </div>*/
}

{
  /*            /!* Extracted <head> HTML *!/*/
}
{
  /*            <Section title="Extracted <head> Tag">*/
}
{
  /*              <TextareaGroup*/
}
{
  /*                autoGrow*/
}
{
  /*                className="font-mono text-xs break-all whitespace-pre-wrap"*/
}
{
  /*                label="HTML Output"*/
}
{
  /*                value={headHtml}*/
}
{
  /*                readOnly*/
}
{
  /*                action={<CopyButton iconOnly textToCopy={headHtml} disabled={!headHtml} />}*/
}
{
  /*              />*/
}
{
  /*            </Section>*/
}

{
  /*            /!*<TextareaGroup*!/*/
}
{
  /*            /!*  autoGrow*!/*/
}
{
  /*            /!*  className="break-all whitespace-pre-wrap"*!/*/
}
{
  /*            /!*  label="Raw JSON Response"*!/*/
}
{
  /*            /!*  value={rawJSON}*!/*/
}
{
  /*            /!*  readOnly*!/*/
}
{
  /*            /!*  action={<CopyButton iconOnly textToCopy={rawJSON} disabled={!rawJSON} />}*!/*/
}
// {/*            /!*/>*!/*/}
// {/*          </div>*/}
{
  /*        )}*/
}
{
  /*      </div>*/
}
{
  /*    </ToolLayout>*/
}
{
  /*  );*/
}
{
  /*}*/
}
