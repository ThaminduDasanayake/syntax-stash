"use client";

import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoTab = "regex" | "curl" | "color" | "uuid";

interface TabConfig {
  badge: string;
  icon: string;
  id: DemoTab;
  label: string;
  slug: string;
}

const TABS: TabConfig[] = [
  { id: "color", badge: "Palette", icon: "🎨", label: "Color Studio", slug: "color-studio" },
  { id: "curl", badge: "Builder", icon: "🔧", label: "cURL Builder", slug: "curl-builder" },
  { id: "regex", badge: "Studio", icon: "⚡", label: "Regex Studio", slug: "regex-studio" },
  { id: "uuid", badge: "Generator", icon: "🔑", label: "UUID Generator", slug: "uuid-generator" },
];

export function HeroWorkbench() {
  const [activeTab, setActiveTab] = useState<DemoTab>("regex");
  const [copied, setCopied] = useState(false);

  // cURL state
  const [curlMethod, setCurlMethod] = useState<"GET" | "POST" | "PUT">("POST");

  // UUID state
  const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "e7b93a14-419b-4e6f-9981-d1c68f638a12";
  };
  const [uuid, setUuid] = useState(generateUUID);

  // Copy handler
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  const activeTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {/* Ambient background glow behind workbench */}
      <div
        aria-hidden="true"
        className="from-brand-orange/20 via-brand-purple/20 to-brand-green/15 pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr opacity-60 blur-2xl transition-all duration-700"
      />

      {/* Main Workbench Window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#18181b]/95 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#141416] px-4 py-3">
          {/* macOS window controls */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full border border-[#ef4444] bg-[#ef4444]/80" />
            <span className="size-3 rounded-full border border-[#f59e0b] bg-[#f59e0b]/80" />
            <span className="size-3 rounded-full border border-[#10b981] bg-[#10b981]/80" />
            <span className="ml-2 hidden font-mono text-[11px] font-semibold text-zinc-500 sm:inline-block">
              workbench.dev
            </span>
          </div>

          {/* Inbuilt Badge */}
          <div className="border-accent/25 bg-accent/10 text-accent flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold">
            <SparkleIcon weight="fill" className="size-3" />
            <span>Interactive Utilities</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-white/[0.08] bg-[#141416]/60 p-1.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none",
                  isActive
                    ? "border border-white/[0.12] bg-[#27272a] text-white shadow-xs"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Body */}
        <div className="flex min-h-[220px] flex-col justify-between p-4 sm:p-5">
          {/* 1. REGEX STUDIO DEMO */}
          {activeTab === "regex" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">Regular Expression</span>
                  <span className="bg-primary/20 py-0.2 text-primary rounded px-1.5 text-[10px] font-bold">
                    flags: gms
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.10] bg-[#121212] px-3.5 py-2.5 font-mono text-xs text-white">
                  <span className="text-accent font-bold">/</span>
                  <span className="text-primary">[a-zA-Z0-9._%+-]+</span>
                  <span className="text-zinc-400">@</span>
                  <span className="text-secondary">[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;</span>
                  <span className="text-accent font-bold">/g</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span>Match Results (2 found)</span>
                  <span className="text-accent flex items-center gap-1 text-[10px] font-bold">
                    <span className="bg-accent size-1.5 animate-pulse rounded-full" /> 0ms compute
                  </span>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-3 font-mono text-xs leading-relaxed">
                  <span className="bg-primary/20 border-primary/40 text-primary rounded-md border px-1.5 py-0.5 font-bold">
                    alex@syntaxstash.dev
                  </span>
                  <span className="mx-1.5 text-zinc-500">&amp;</span>
                  <span className="bg-secondary/20 border-secondary/40 text-secondary rounded-md border px-1.5 py-0.5 font-bold">
                    team@vercel.com
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. CURL BUILDER DEMO */}
          {activeTab === "curl" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {(["GET", "POST", "PUT"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setCurlMethod(method)}
                    className={cn(
                      "cursor-pointer rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all",
                      curlMethod === method
                        ? "bg-accent text-black shadow-xs"
                        : "border border-white/5 bg-white/[0.05] text-zinc-400 hover:text-white",
                    )}
                  >
                    {method}
                  </button>
                ))}
                <span className="ml-1 truncate font-mono text-xs text-zinc-400">
                  https://api.syntaxstash.dev/v1/deploy
                </span>
              </div>

              <div className="relative rounded-xl border border-white/[0.08] bg-[#121212] p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
                <div className="mb-1 text-zinc-400">
                  <span className="text-primary font-bold">$ curl</span> -X {curlMethod}{" "}
                  https://api.syntaxstash.dev/v1/deploy \
                </div>
                <div className="pl-4 text-zinc-500">
                  -H{" "}
                  <span className="text-secondary">
                    &apos;Authorization: Bearer dev_stash_sec&apos;
                  </span>{" "}
                  \
                </div>
                <div className="pl-4 text-zinc-500">
                  -H{" "}
                  <span className="text-secondary">&apos;Content-Type: application/json&apos;</span>
                  {curlMethod !== "GET" && <span> \</span>}
                </div>
                {curlMethod !== "GET" && (
                  <div className="pl-4 text-zinc-500">
                    -d{" "}
                    <span className="text-accent">
                      &apos;&#123;&quot;branch&quot;:&quot;main&quot;,&quot;build&quot;:&quot;prod&quot;&#125;&apos;
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `curl -X ${curlMethod} https://api.syntaxstash.dev/v1/deploy -H 'Authorization: Bearer dev_stash_sec'`,
                    )
                  }
                  className="absolute top-2.5 right-2.5 flex size-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition-all hover:bg-white/15 hover:text-white"
                  title="Copy command"
                >
                  {copied ? (
                    <CheckIcon weight="bold" className="text-accent size-3.5" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 3. COLOR STUDIO DEMO */}
          {activeTab === "color" && (
            <div className="flex flex-col gap-3">
              <div className="from-brand-orange via-brand-purple to-brand-green h-10 w-full rounded-xl border border-white/10 bg-gradient-to-r shadow-sm" />

              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-brand-orange size-3 rounded-full border border-white/20" />
                    <span className="font-bold text-white">Amber</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">#F59E0B</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-brand-purple size-3 rounded-full border border-white/20" />
                    <span className="font-bold text-white">Lilac</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">#C084FC</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-brand-green size-3 rounded-full border border-white/20" />
                    <span className="font-bold text-white">Lime</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">#84CC16</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. UUID GENERATOR DEMO */}
          {activeTab === "uuid" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300">Cryptographically Secure (v4)</span>
                <span className="text-accent font-bold">RFC 4122 Standard</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.10] bg-[#121212] px-3.5 py-3 font-mono text-xs text-white">
                <span className="text-primary truncate font-bold tracking-wider">{uuid}</span>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUuid(generateUUID())}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition-all hover:bg-white/15 hover:text-white"
                    title="Generate new UUID"
                  >
                    <ArrowsClockwiseIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(uuid)}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 transition-all hover:bg-white/15 hover:text-white"
                    title="Copy UUID"
                  >
                    {copied ? (
                      <CheckIcon weight="bold" className="text-accent size-3.5" />
                    ) : (
                      <CopyIcon className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="font-mono text-[10.5px] text-zinc-500">
                Generated locally using Web Crypto API. No network calls.
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3.5">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="bg-accent size-2 animate-pulse rounded-full" />
              <span>Client-side • 0ms latency</span>
            </div>

            <Button
              asChild
              size="sm"
              variant="default"
              className="rounded-full font-mono text-xs font-bold"
            >
              <Link href={`/tools/${activeTabConfig.slug}`}>
                Launch {activeTabConfig.label}
                <ArrowRightIcon weight="bold" className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
