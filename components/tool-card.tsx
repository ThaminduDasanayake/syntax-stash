"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { memo } from "react";

import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { InternalTool, ToolCardProps } from "@/types";

function ToolSchematicPreview({ tool }: { tool: InternalTool }) {
  const slug = tool.slug;

  if (slug === "curl-builder") {
    return (
      <div className="font-mono text-[11px] leading-relaxed text-zinc-400 bg-black/40 rounded-lg p-2.5 border border-white/5">
        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-0.5">
          <span className="text-accent font-bold">POST</span>
          <span className="truncate">/api/v1/deploy</span>
        </div>
        <div className="truncate text-zinc-300">
          <span className="text-primary font-semibold">$ curl</span> -X POST https://api...
        </div>
        <div className="text-[10px] text-zinc-500 truncate mt-0.5">
          -H <span className="text-secondary">&apos;Authorization: Bearer ***&apos;</span>
        </div>
      </div>
    );
  }

  if (slug === "regex-studio") {
    return (
      <div className="font-mono text-[11px] bg-black/40 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">Pattern</span>
          <span className="bg-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">flags: gms</span>
        </div>
        <div className="text-zinc-200 truncate font-semibold bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 text-[10.5px]">
          <span className="text-accent">/</span>[a-z0-9_]+@[a-z]+\.[a-z]&#123;2,&#125;<span className="text-accent">/g</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span>3 matches found</span>
        </div>
      </div>
    );
  }

  if (slug === "diff-viewer") {
    return (
      <div className="font-mono text-[10.5px] leading-tight bg-black/40 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
        <div className="text-red-400/90 bg-red-500/10 px-1.5 py-0.5 rounded flex items-center gap-1.5 truncate">
          <span className="font-bold">-</span> const timeout = 5000;
        </div>
        <div className="text-accent/90 bg-accent/10 px-1.5 py-0.5 rounded flex items-center gap-1.5 truncate">
          <span className="font-bold">+</span> const timeout = 15000;
        </div>
        <div className="text-zinc-400 px-1.5 py-0.5 flex items-center gap-1.5 truncate">
          <span className="text-zinc-600"> </span> return connect(timeout);
        </div>
      </div>
    );
  }

  if (slug === "color-studio") {
    return (
      <div className="flex flex-col gap-2 bg-black/40 rounded-lg p-2.5 border border-white/5">
        <div className="h-5 w-full rounded-md bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green shadow-xs" />
        <div className="flex items-center justify-between text-[10.5px] font-mono">
          <span className="text-zinc-400">oklch(0.76 0.15 76.8)</span>
          <span className="text-accent font-bold">#F59E0B</span>
        </div>
      </div>
    );
  }

  if (slug === "cron-studio") {
    return (
      <div className="font-mono text-[11px] bg-black/40 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
        <div className="text-primary font-bold text-center tracking-widest text-xs bg-primary/10 py-1 rounded border border-primary/20">
          */15 09-18 * * 1-5
        </div>
        <div className="text-[10px] text-zinc-400 text-center truncate">
          Every 15m (Mon-Fri 9AM-6PM)
        </div>
      </div>
    );
  }

  if (
    slug === "hash-generator" ||
    slug === "encoder-decoder" ||
    slug === "jwt-decoder" ||
    slug === "uuid-generator" ||
    slug === "secret-generator" ||
    slug === "universal-decoder"
  ) {
    return (
      <div className="font-mono text-[10.5px] bg-black/40 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span className="text-accent font-semibold uppercase">{tool.highlight || "Crypto"} Engine</span>
          <span className="text-zinc-400">256-bit</span>
        </div>
        <div className="text-zinc-300 truncate bg-white/[0.03] p-1 rounded text-[10px]">
          {slug === "uuid-generator"
            ? "e7b93a14-419b-4e6f-9981-d1c68f638a12"
            : "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b..."}
        </div>
      </div>
    );
  }

  if (
    slug === "json-studio" ||
    slug === "json-schema-studio" ||
    slug === "json-csv-converter" ||
    slug === "mock-data-generator" ||
    slug === "mongo-pipeline-builder" ||
    slug === "drizzle-schema-studio" ||
    slug === "sql-formatter" ||
    slug === "yaml-json-converter" ||
    slug === "xml-studio"
  ) {
    return (
      <div className="font-mono text-[10.5px] leading-relaxed bg-black/40 rounded-lg p-2.5 border border-white/5 text-zinc-300">
        <span className="text-zinc-500">&#123;</span>
        <div className="pl-3 truncate">
          <span className="text-secondary">&quot;status&quot;</span>: <span className="text-accent">&quot;ok&quot;</span>,
          <span className="text-secondary"> &quot;code&quot;</span>: <span className="text-primary font-bold">200</span>
        </div>
        <span className="text-zinc-500">&#125;</span>
      </div>
    );
  }

  if (
    slug === "css-studio" ||
    slug === "tailwind-studio" ||
    slug === "css-to-tailwind" ||
    slug === "html-to-jsx"
  ) {
    return (
      <div className="font-mono text-[10.5px] leading-relaxed bg-black/40 rounded-lg p-2.5 border border-white/5 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] truncate">
          <span className="text-primary font-bold">.glassmorphic</span> &#123;
        </div>
        <div className="pl-3 text-[10px] text-zinc-300 truncate">
          backdrop-filter: <span className="text-accent">blur(16px)</span>;
        </div>
      </div>
    );
  }

  if (slug === "qr-generator" || slug === "image-converter") {
    return (
      <div className="flex items-center justify-between bg-black/40 rounded-lg p-2 border border-white/5">
        <div className="grid grid-cols-4 gap-1 p-1 bg-white/10 rounded">
          <div className="size-1.5 bg-primary rounded-xs" />
          <div className="size-1.5 bg-white rounded-xs" />
          <div className="size-1.5 bg-accent rounded-xs" />
          <div className="size-1.5 bg-white rounded-xs" />
          <div className="size-1.5 bg-white rounded-xs" />
          <div className="size-1.5 bg-primary rounded-xs" />
          <div className="size-1.5 bg-white rounded-xs" />
          <div className="size-1.5 bg-accent rounded-xs" />
        </div>
        <div className="font-mono text-[10px] text-right flex flex-col">
          <span className="text-white font-bold">{slug === "qr-generator" ? "Vector QR" : "WebP / AVIF"}</span>
          <span className="text-zinc-500">Browser Native</span>
        </div>
      </div>
    );
  }

  // General default schematic preview
  return (
    <div className="font-mono text-[10.5px] bg-black/40 rounded-lg p-2.5 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent animate-pulse" />
        <span className="text-zinc-300 font-semibold">{tool.category}</span>
      </div>
      <span className="text-zinc-500 text-[10px]">Client-side</span>
    </div>
  );
}

function ToolCardComponent({ tool }: ToolCardProps) {
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;

  const totalTools = internalTools.length;
  const toolIndex = internalTools.findIndex((t) => t.slug === tool.slug);
  const currentNumber = toolIndex !== -1 ? String(toolIndex + 1).padStart(2, "0") : "01";
  const totalFormatted = String(totalTools).padStart(2, "0");
  const toolNumber = `${currentNumber}/${totalFormatted}`;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block h-full w-full cursor-pointer text-left outline-none"
    >
      <article
        data-slot="tool-card"
        className="group relative flex h-full flex-col select-none"
      >
        {/* 1. Visual Interactive Stage: 16:10 Canvas with Schematic Preview */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#18181b] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
          {/* Header Row: Tool Icon Squircle + Tool Index & Launch Arrow */}
          <div className="flex items-center justify-between gap-3">
            <div className="border border-white/10 bg-white/[0.04] text-white group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_4px_16px_rgba(230,126,34,0.3)] flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300">
              <Icon className="size-4.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="border border-white/10 bg-white/[0.04] text-zinc-400 rounded-md px-2 py-0.5 font-mono text-xs font-semibold tabular-nums">
                {toolNumber}
              </span>
              <HugeiconsIcon
                aria-hidden="true"
                icon={ArrowUpRight01Icon}
                strokeWidth={2}
                className="text-zinc-500 group-hover:text-primary size-4 shrink-0 transition-colors"
              />
            </div>
          </div>

          {/* Schematic Preview Area */}
          <div className="relative z-1">
            <ToolSchematicPreview tool={tool} />
          </div>

          {/* Ambient Background Aura */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full bg-gradient-to-br from-brand-orange/10 via-brand-purple/10 to-transparent blur-xl transition-all duration-500 group-hover:scale-150 group-hover:from-brand-orange/25 group-hover:via-brand-purple/20" />
        </div>

        {/* 2. Text Block Below Stage */}
        <div className="flex flex-col gap-1.5 pt-3.5 px-0.5">
          {/* Row 1: Title + Capability Badge */}
          <div className="flex items-center justify-between gap-2.5">
            <h3
              title={tool.title}
              className="text-white font-mono text-base font-bold tracking-tight truncate relative inline-block after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {tool.title}
            </h3>

            {tool.highlight ? (
              <span className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold shadow-xs shrink-0">
                {tool.highlight}
              </span>
            ) : (
              <span className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold shadow-xs shrink-0">
                Inbuilt
              </span>
            )}
          </div>

          {/* Row 2: Description */}
          <p className="text-zinc-400 font-sans text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

export const ToolCard = memo(ToolCardComponent);
export default ToolCard;
