"use client";

import {
  ArrowSquareOutIcon,
  CodeIcon,
  GlobeIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";

import { ExtractedMetadata, parseHeadHtml } from "@/app/tools/web-extractor/head-parser";
import { MetaRow } from "@/app/tools/web-extractor/meta-row";
import { Section } from "@/app/tools/web-extractor/section";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { InputField } from "@/components/ui/input-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function WebExtractorPage() {
  const [activeTab, setActiveTab] = useState<"url" | "paste">("url");
  const [url, setUrl] = useState("");
  const [pastedHtml, setPastedHtml] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headHtml, setHeadHtml] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleManualParse() {
    const trimmedHtml = pastedHtml.trim();
    if (!trimmedHtml) {
      setError("Please paste <head> tag HTML content to parse.");
      return;
    }

    setError(null);
    try {
      const parsed = parseHeadHtml(trimmedHtml, baseUrlInput.trim() || undefined);
      setHeadHtml(trimmedHtml);
      setMetadata(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse pasted HTML content.");
    }
  }

  function handleClear() {
    setUrl("");
    setPastedHtml("");
    setBaseUrlInput("");
    setHeadHtml(null);
    setMetadata(null);
    setError(null);
  }

  const tool = internalTools.find((t) => t.slug === "web-extractor");

  function beautifyHtml(html: string): string {
    let indentLevel = 0;
    const indentSize = 2;

    const tokens = html
      .replace(/>\s*</g, ">\n<")
      .split("\n")
      .map((token) => token.trim())
      .filter(Boolean);

    return tokens
      .map((token) => {
        if (/^<\//.test(token)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const line = " ".repeat(indentLevel * indentSize) + token;

        const isOpeningTag = /^<[a-zA-Z0-9-]+/.test(token);
        const isSelfClosing = /\/>$/.test(token) || /^<(meta|link|img|br|hr|input)/i.test(token);
        const isClosingTag = /^<\//.test(token);

        if (isOpeningTag && !isSelfClosing && !isClosingTag) {
          indentLevel++;
        }

        return line;
      })
      .join("\n");
  }

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as "url" | "paste");
            setError(null);
          }}
          className="mx-auto w-full max-w-2xl shrink-0"
        >
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <GlobeIcon size={16} className="mr-2 shrink-0" />
              Fetch via URL
            </TabsTrigger>
            <TabsTrigger value="paste">
              <CodeIcon size={16} className="mr-2 shrink-0" />
              Paste &lt;head&gt; HTML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleExtract();
              }}
              className="space-y-4"
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
                    onClick={handleClear}
                    disabled={loading || (!url && !headHtml && !pastedHtml)}
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
          </TabsContent>

          <TabsContent value="paste">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleManualParse();
              }}
              className="space-y-4"
            >
              <TextareaGroup
                label="Paste <head> Tag HTML"
                placeholder="<head>&#10;  <title>Example Page</title>&#10;  <meta name='description' content='Page description...'>&#10;</head>"
                value={pastedHtml}
                onChange={(e) => setPastedHtml(e.target.value)}
                rows={6}
                className="font-mono text-xs"
              />

              <InputField
                label="Base URL (Optional)"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="https://example.com (for resolving relative favicon / og:image links)"
                suffix={
                  <ClearButton
                    type="button"
                    iconOnly
                    onClick={handleClear}
                    disabled={!url && !headHtml && !pastedHtml && !baseUrlInput}
                  />
                }
              />

              <Button type="submit" className="w-full font-semibold">
                <LightningIcon weight="bold" />
                Extract Data from HTML
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mx-auto w-full max-w-2xl shrink-0 space-y-3">
            <ErrorAlert message={error} />
            {activeTab === "url" && (
              <div className="border-amber-500/20 bg-amber-500/10 flex flex-col gap-2 border p-3.5 text-xs text-amber-600 dark:text-amber-400 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">API credits run out or request failed?</p>
                  <p className="text-muted-foreground mt-0.5">
                    You can paste the website's raw &lt;head&gt; tag HTML directly to extract all metadata offline.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 font-medium"
                  onClick={() => {
                    if (url) {
                      setBaseUrlInput(url);
                    }
                    setActiveTab("paste");
                    setError(null);
                  }}
                >
                  <CodeIcon size={14} className="mr-1.5" />
                  Paste &lt;head&gt; HTML Manually
                </Button>
              </div>
            )}
          </div>
        )}

        {!headHtml && !loading && !error && (
          <EmptyState
            title="Awaiting Input"
            description="Enter a website URL to fetch via API, or paste raw <head> HTML to extract structured metadata directly."
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
              {metadata.url.startsWith("http://") || metadata.url.startsWith("https://") ? (
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground truncate font-mono text-sm font-medium hover:underline"
                >
                  {metadata.url}
                </a>
              ) : (
                <span className="text-foreground truncate font-mono text-sm font-medium">
                  {metadata.url}
                </span>
              )}
              {metadata.url.startsWith("http") && (
                <ArrowSquareOutIcon
                  weight="duotone"
                  size={16}
                  className="text-muted-foreground ml-auto shrink-0"
                />
              )}
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

            <Section title="Asset Links">
              <div className="flex flex-col">
                <MetaRow label="Favicon (PNG)" value={metadata.assets.favicon} />
                <MetaRow label="Favicon (SVG)" value={metadata.assets.faviconSvg} />
                <MetaRow label="Apple Touch Icon" value={metadata.assets.appleTouchIcon} />
                <MetaRow label="JSON-LD Logo" value={metadata.assets.logo} />
                <MetaRow label="OG Image" value={metadata.assets.ogImage} />
                <MetaRow label="Twitter Image" value={metadata.assets.twitterImage} />
                <MetaRow label="Screenshots" value={metadata.assets.screenshots.join(", ")} />
              </div>
            </Section>

            {/* Raw HTML Fallback */}
            <Section title="Extracted <head> Tag">
              <TextareaGroup
                autoGrow
                className="font-mono text-xs! break-all whitespace-pre-wrap"
                label="HTML Output"
                value={beautifyHtml(headHtml)}
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
