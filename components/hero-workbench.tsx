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
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Ambient background glow behind workbench */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-orange/20 via-brand-purple/20 to-brand-green/15 blur-2xl opacity-60 transition-all duration-700"
      />

      {/* Main Workbench Window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#18181b]/95 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#141416] px-4 py-3">
          {/* macOS window controls */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ef4444]/80 border border-[#ef4444]" />
            <span className="size-3 rounded-full bg-[#f59e0b]/80 border border-[#f59e0b]" />
            <span className="size-3 rounded-full bg-[#10b981]/80 border border-[#10b981]" />
            <span className="ml-2 font-mono text-[11px] font-semibold text-zinc-500 hidden sm:inline-block">
              workbench.dev
            </span>
          </div>

          {/* Inbuilt Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent">
            <SparkleIcon weight="fill" className="size-3" />
            <span>Interactive Utilities</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-white/[0.08] bg-[#141416]/60 p-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer outline-none",
                  isActive
                    ? "bg-[#27272a] text-white border border-white/[0.12] shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]",
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Body */}
        <div className="p-4 sm:p-5 min-h-[220px] flex flex-col justify-between">
          {/* 1. REGEX STUDIO DEMO */}
          {activeTab === "regex" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="font-semibold text-zinc-300">Regular Expression</span>
                  <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
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
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Match Results (2 found)</span>
                  <span className="text-accent font-bold text-[10px] flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse" /> 0ms compute
                  </span>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-3 font-mono text-xs leading-relaxed">
                  <span className="rounded-md bg-primary/20 border border-primary/40 px-1.5 py-0.5 text-primary font-bold">
                    alex@syntaxstash.dev
                  </span>
                  <span className="text-zinc-500 mx-1.5">&amp;</span>
                  <span className="rounded-md bg-secondary/20 border border-secondary/40 px-1.5 py-0.5 text-secondary font-bold">
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
                      "rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all cursor-pointer",
                      curlMethod === method
                        ? "bg-accent text-black shadow-xs"
                        : "bg-white/[0.05] text-zinc-400 hover:text-white border border-white/5",
                    )}
                  >
                    {method}
                  </button>
                ))}
                <span className="font-mono text-xs text-zinc-400 truncate ml-1">
                  https://api.syntaxstash.dev/v1/deploy
                </span>
              </div>

              <div className="relative rounded-xl border border-white/[0.08] bg-[#121212] p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
                <div className="text-zinc-400 mb-1">
                  <span className="text-primary font-bold">$ curl</span> -X {curlMethod} https://api.syntaxstash.dev/v1/deploy \
                </div>
                <div className="text-zinc-500 pl-4">
                  -H <span className="text-secondary">&apos;Authorization: Bearer dev_stash_sec&apos;</span> \
                </div>
                <div className="text-zinc-500 pl-4">
                  -H <span className="text-secondary">&apos;Content-Type: application/json&apos;</span>
                  {curlMethod !== "GET" && <span> \</span>}
                </div>
                {curlMethod !== "GET" && (
                  <div className="text-zinc-500 pl-4">
                    -d <span className="text-accent">&apos;&#123;&quot;branch&quot;:&quot;main&quot;,&quot;build&quot;:&quot;prod&quot;&#125;&apos;</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `curl -X ${curlMethod} https://api.syntaxstash.dev/v1/deploy -H 'Authorization: Bearer dev_stash_sec'`,
                    )
                  }
                  className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <CheckIcon weight="bold" className="text-accent size-3.5" /> : <CopyIcon className="size-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* 3. COLOR STUDIO DEMO */}
          {activeTab === "color" && (
            <div className="flex flex-col gap-3">
              <div className="h-10 w-full rounded-xl bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green shadow-sm border border-white/10" />

              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-brand-orange border border-white/20" />
                    <span className="text-white font-bold">Amber</span>
                  </div>
                  <span className="text-zinc-400 text-[10px]">#F59E0B</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-brand-purple border border-white/20" />
                    <span className="text-white font-bold">Lilac</span>
                  </div>
                  <span className="text-zinc-400 text-[10px]">#C084FC</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-brand-green border border-white/20" />
                    <span className="text-white font-bold">Lime</span>
                  </div>
                  <span className="text-zinc-400 text-[10px]">#84CC16</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. UUID GENERATOR DEMO */}
          {activeTab === "uuid" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-300 font-semibold">Cryptographically Secure (v4)</span>
                <span className="text-accent font-bold">RFC 4122 Standard</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.10] bg-[#121212] px-3.5 py-3 font-mono text-xs text-white">
                <span className="text-primary font-bold tracking-wider truncate">{uuid}</span>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setUuid(generateUUID())}
                    className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                    title="Generate new UUID"
                  >
                    <ArrowsClockwiseIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(uuid)}
                    className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                    title="Copy UUID"
                  >
                    {copied ? <CheckIcon weight="bold" className="text-accent size-3.5" /> : <CopyIcon className="size-3.5" />}
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
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span>Client-side • 0ms latency</span>
            </div>

            <Button asChild size="sm" variant="default" className="rounded-full font-mono text-xs font-bold">
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
