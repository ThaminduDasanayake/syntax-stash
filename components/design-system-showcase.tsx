/* eslint-disable perfectionist/sort-objects, perfectionist/sort-arrays */
"use client";

import {
  BookmarkSimpleIcon,
  CheckCircleIcon,
  CopyIcon,
  EyeIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  TextTIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DotButton } from "@/components/dot-button";
import { ResourceCardView } from "@/components/resource-card-view";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryItem } from "@/lib/categories";
import { cn, getCategoryTheme, Theme, THEME_CONFIG, THEMES } from "@/lib/utils";

interface ColorSwatchInfo {
  theme: Theme;
  name: string;
  source: string;
  oklch: string;
  hex: string;
  tintHex: string;
  deepHex: string;
  textColor: "text-ink" | "text-paper";
  description: string;
  cssVar: string;
}

const COLOR_SWATCHES: ColorSwatchInfo[] = [
  {
    theme: "red",
    name: "Cardinal Red",
    source: "Color Studio (Neo-Brutalist AAA)",
    oklch: "oklch(42% 0.21 27)",
    hex: "#9b111e",
    tintHex: "#fedbdc",
    deepHex: "#64000b",
    textColor: "text-paper",
    description: "1st in Alphabetical Order: AI, Artificial Intelligence & Machine Learning.",
    cssVar: "--red",
  },
  {
    theme: "orange",
    name: "Amber Honey",
    source: "Core Brand Base",
    oklch: "oklch(75% 0.16 70)",
    hex: "#e8a52b",
    tintHex: "#f4dda5",
    deepHex: "#b87e00",
    textColor: "text-ink",
    description: "2nd in Alphabetical Order: Animations, Motion & Canvas Graphics.",
    cssVar: "--orange",
  },
  {
    theme: "yellow",
    name: "Lemon Sun",
    source: "Color Studio (Malibu Postcard)",
    oklch: "oklch(93.5% 0.16 102)",
    hex: "#fff064",
    tintHex: "#fefcd4",
    deepHex: "#caa712",
    textColor: "text-ink",
    description: "3rd in Alphabetical Order: Backend, Databases, SQL & Boilerplates.",
    cssVar: "--yellow",
  },
  {
    theme: "green",
    name: "Fresh Grass",
    source: "Color Studio (Fresh Greenery)",
    oklch: "oklch(76% 0.20 135)",
    hex: "#88cb02",
    tintHex: "#e5f6cd",
    deepHex: "#3f7800",
    textColor: "text-ink",
    description: "4th in Alphabetical Order: Components, UI Kits & Component Libraries.",
    cssVar: "--green",
  },
  {
    theme: "cyan",
    name: "Blue Slush",
    source: "Color Studio (Ice Pop)",
    oklch: "oklch(84% 0.09 232)",
    hex: "#9dd6fa",
    tintHex: "#e4f2fc",
    deepHex: "#4c9cd3",
    textColor: "text-ink",
    description: "5th in Alphabetical Order: CSS, Styling Engines, Tailwind & Cheatsheets.",
    cssVar: "--cyan",
  },
  {
    theme: "blue",
    name: "Cobalt Electric",
    source: "Core Brand Base",
    oklch: "oklch(42% 0.19 265)",
    hex: "#2a47b8",
    tintHex: "#c8d2ee",
    deepHex: "#1a2a7a",
    textColor: "text-paper",
    description: "6th in Alphabetical Order: Documentation, DevOps, Dev Tools & Cloud.",
    cssVar: "--blue",
  },
  {
    theme: "purple",
    name: "Berry Plum",
    source: "Color Studio (The Vienna Cafe / Dried Roses)",
    oklch: "oklch(43% 0.11 348)",
    hex: "#683557",
    tintHex: "#fae8f3",
    deepHex: "#441f38",
    textColor: "text-paper",
    description: "7th in Alphabetical Order: Icons, Logos, Media Assets & Design Systems.",
    cssVar: "--purple",
  },
  {
    theme: "pink",
    name: "Cyber Lilac",
    source: "Core Brand Base",
    oklch: "oklch(75% 0.14 310)",
    hex: "#c9a4f0",
    tintHex: "#ecddf8",
    deepHex: "#6b35b8",
    textColor: "text-ink",
    description: "8th in Alphabetical Order: Testing, QA, Performance, Tools & Utilities.",
    cssVar: "--pink",
  },
];

const SAMPLE_RESOURCES_BY_THEME: Record<
  Theme,
  {
    title: string;
    subtitle: string;
    category: string;
    description: string;
    author: string;
    stars: number;
    tags: string[];
    url: string;
  }
> = {
  red: {
    title: "Vercel AI SDK",
    subtitle: "The TypeScript toolkit for AI apps",
    category: "AI & Machine Learning",
    description:
      "Unified provider architecture to build conversational streaming web interfaces with OpenAI, Anthropic, and Google Gemini.",
    author: "Vercel",
    stars: 19800,
    tags: ["AI", "LLM", "Streaming"],
    url: "https://sdk.vercel.ai",
  },
  orange: {
    title: "Motion One & Framer",
    subtitle: "Modern animation engine for the web",
    category: "Animations & Motion",
    description:
      "Production-ready motion animation library built on the Web Animations API with tiny bundle size and high framerates.",
    author: "Matt Perry",
    stars: 29400,
    tags: ["Animation", "React", "WAAPI"],
    url: "https://motion.dev",
  },
  yellow: {
    title: "Drizzle ORM",
    subtitle: "TypeScript ORM that lets you say SQL",
    category: "Backend & Databases",
    description:
      "Lightweight, performant, and developer-friendly TypeScript ORM with zero dependencies and SQL-like query builder.",
    author: "Drizzle Team",
    stars: 36500,
    tags: ["TypeScript", "SQL", "Database"],
    url: "https://orm.drizzle.team",
  },
  green: {
    title: "Lucide Icons & UI",
    subtitle: "Clean & accessible UI component kit",
    category: "Components & UI",
    description:
      "Comprehensive component primitives and vector icons designed for high-contrast accessibility and modern ergonomics.",
    author: "Lucide Project",
    stars: 17200,
    tags: ["Components", "React", "UI"],
    url: "https://lucide.dev",
  },
  cyan: {
    title: "Tailwind CSS v4.0",
    subtitle: "High-performance CSS styling engine",
    category: "CSS & Styling",
    description:
      "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    author: "Tailwind Labs",
    stars: 84200,
    tags: ["CSS", "Frontend", "Compiler"],
    url: "https://tailwindcss.com",
  },
  blue: {
    title: "Biomark Dev Docs",
    subtitle: "Clean Markdown publishing framework",
    category: "Documentation & DevOps",
    description:
      "Fast documentation engine built for speed, full-text offline search, and seamless OpenAPI schema visualization.",
    author: "Biome Authors",
    stars: 12400,
    tags: ["Docs", "Markdown", "Search"],
    url: "https://biomejs.dev",
  },
  purple: {
    title: "Svgl Vector Logos",
    subtitle: "A massive library of SVGs",
    category: "Icons & Logos",
    description:
      "Curated collection of pristine SVG icons and tech logos with instant copy-to-clipboard and React snippet export.",
    author: "E spill",
    stars: 8900,
    tags: ["SVG", "Icons", "Assets"],
    url: "https://svgl.app",
  },
  pink: {
    title: "Vitest Runner",
    subtitle: "Blazing fast unit test framework",
    category: "Testing & QA",
    description:
      "Next-generation testing framework powered by Vite with out-of-the-box ESM, TypeScript, and JSX support.",
    author: "Anthony Fu",
    stars: 16800,
    tags: ["Testing", "Vite", "ESM"],
    url: "https://vitest.dev",
  },
};

interface DesignSystemShowcaseProps {
  categories: CategoryItem[];
}

export function DesignSystemShowcase({ categories }: DesignSystemShowcaseProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("orange");
  const [simulatedCategory, setSimulatedCategory] = useState<string>(
    categories[0]?.name || "Icons",
  );
  const [sampleQuery, setSampleQuery] = useState("");
  const [isBookmarkedDemo, setIsBookmarkedDemo] = useState(false);
  const [customTypoText, setCustomTypoText] = useState("Syntax Stash _curated_ for developers");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied "${text}" to clipboard`);
  };

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const simulatedTheme = useMemo(() => {
    return getCategoryTheme(simulatedCategory, "resource", undefined, categoryNames);
  }, [simulatedCategory, categoryNames]);

  return (
    <div className="lib-page">
      {/* Header Banner */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="bg-ink text-paper px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase">
              Design Specification v2.0
            </span>
            <span className="border-ink bg-paper text-ink border px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase">
              8-Color Neo-Brutalist System
            </span>
          </div>

          <h1 className="lib-headline">
            SYNTAX STASH <em>design system</em>
          </h1>
          <p className="lib-sub max-w-3xl">
            A comprehensive design language built with bold typographic tension, hard-edged
            brutalist geometry, tactile shadows, and an expanded 8-color category theme matrix.
          </p>

          {/* Quick Jump Navigation */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {[
              { label: "01. Typography", href: "#typography" },
              { label: "02. 8-Color Palette Matrix", href: "#colors" },
              { label: "03. Category Simulator", href: "#simulator" },
              { label: "04. Atomic UI Sandbox", href: "#sandbox" },
              { label: "05. Contrast & Accessibility", href: "#contrast" },
            ].map((nav) => (
              <a
                key={nav.href}
                href={nav.href}
                className="border-ink bg-bg hover:bg-ink hover:text-paper border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors duration-150"
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="mx-auto w-full max-w-7xl space-y-20 px-5 py-12 md:px-8">
        {/* ========================================================================= */}
        {/* SECTION 1: TYPOGRAPHY HIERARCHY */}
        {/* ========================================================================= */}
        <section id="typography" className="scroll-mt-24">
          <div className="cat-divider border-ink border-b-2 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-ink text-paper flex size-8 items-center justify-center font-mono text-sm font-bold">
                01
              </span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight uppercase sm:text-3xl">
                  Typography System & Scales
                </h2>
                <p className="text-ink-mute font-mono text-xs tracking-wider uppercase">
                  Bricolage Grotesque · Instrument Serif · JetBrains Mono · Inter
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live Type Tester */}
          <div className="border-ink bg-paper mt-8 border-2 p-6 shadow-sm">
            <div className="border-line mb-6 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <TextTIcon className="text-ink size-5" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase">
                  Interactive Type Previewer (Wrap words in underscores for _serif italic_)
                </span>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() =>
                  setCustomTypoText("Discover the best _developer tools_ in the ecosystem")
                }
              >
                Reset Sample
              </Button>
            </div>

            <Input
              value={customTypoText}
              onChange={(e) => setCustomTypoText(e.target.value)}
              placeholder="Type your preview text here..."
              className="bg-bg mb-8 font-mono text-sm"
            />

            {/* Rendered Type Scales */}
            <div className="space-y-8">
              {/* Display Headline */}
              <div className="border-line space-y-2 border-b pb-6">
                <div className="text-mono-2xs text-ink-mute flex items-center justify-between">
                  <span>Display Headline (`.headline`)</span>
                  <span>Bricolage Grotesque 800 + Instrument Serif</span>
                </div>
                <div
                  className="headline text-ink"
                  dangerouslySetInnerHTML={{
                    __html: customTypoText.replace(/_([^_]+)_/g, "<em>$1</em>"),
                  }}
                />
              </div>

              {/* Display 3XL / 2XL */}
              <div className="border-line grid grid-cols-1 gap-8 border-b pb-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-mono-2xs text-ink-mute">
                    Display Section Header (`text-3xl font-extrabold`)
                  </div>
                  <h3 className="font-display text-3xl font-extrabold tracking-tight uppercase">
                    {customTypoText.replace(/_/g, "")}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="text-mono-2xs text-ink-mute">Card Title (`card-title`)</div>
                  <h4 className="font-display text-2xl font-bold tracking-tight uppercase">
                    {customTypoText.replace(/_/g, "")}
                  </h4>
                </div>
              </div>

              {/* Mono Scales */}
              <div className="border-line space-y-4 border-b pb-6">
                <div className="text-mono-2xs text-ink-mute">
                  JetBrains Mono Metas (`text-mono-*`)
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="border-line bg-bg border p-3">
                    <span className="text-mono-2xs block">text-mono-2xs (10px)</span>
                    <span className="text-ink-mute text-xs">Category & Tag Badges</span>
                  </div>
                  <div className="border-line bg-bg border p-3">
                    <span className="text-mono-xs block">text-mono-xs (12px)</span>
                    <span className="text-ink-mute text-xs">Filter Counts & Stats</span>
                  </div>
                  <div className="border-line bg-bg border p-3">
                    <span className="text-mono-sm block">text-mono-sm (14px)</span>
                    <span className="text-ink-mute text-xs">Buttons & Nav Items</span>
                  </div>
                  <div className="border-line bg-bg border p-3">
                    <span className="text-mono-base block">text-mono-base (16px)</span>
                    <span className="text-ink-mute text-xs">Code Snippets & Keys</span>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-mono-2xs text-ink-mute">Body Regular (Inter 15px/1.6)</div>
                  <p className="text-ink-2 font-sans text-[15px] leading-relaxed">
                    Syntax Stash provides an uncompromising reference for modern web development, UI
                    patterns, and developer productivity tools. Each item is strictly curated and
                    cataloged.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-mono-2xs text-ink-mute">
                    Card Description (`card-description`)
                  </div>
                  <p className="text-ink-mute font-sans text-sm leading-relaxed font-medium">
                    Curated selection of open-source frameworks, micro-libraries, and developer
                    utilities built for high-performance frontend engineering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: 8-COLOR THEME MATRIX */}
        {/* ========================================================================= */}
        <section id="colors" className="scroll-mt-24">
          <div className="cat-divider border-ink border-b-2 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-ink text-paper flex size-8 items-center justify-center font-mono text-sm font-bold">
                02
              </span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight uppercase sm:text-3xl">
                  The 8-Color Neo-Brutalist Theme Matrix
                </h2>
                <p className="text-ink-mute font-mono text-xs tracking-wider uppercase">
                  Curated brutalist palette: Orange, Blue, Pink, Green, Purple, Yellow, Cyan, Red
                </p>
              </div>
            </div>
          </div>

          {/* Theme Selector Strip */}
          <div className="bg-bg-2 border-ink mt-8 flex flex-wrap items-center gap-2 border-2 p-3">
            <span className="text-mono-xs text-ink mr-2">Select Active Theme:</span>
            {THEMES.map((theme) => {
              const isActive = selectedTheme === theme;
              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all",
                    isActive
                      ? "border-ink scale-105 shadow-xs"
                      : "hover:border-line border-transparent",
                    THEME_CONFIG[theme].bg,
                  )}
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full border border-current",
                      isActive ? "bg-current" : "bg-transparent",
                    )}
                  />
                  <span>{theme}</span>
                </button>
              );
            })}
          </div>

          {/* 8 Palette Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = selectedTheme === swatch.theme;
              return (
                <div
                  key={swatch.theme}
                  onClick={() => setSelectedTheme(swatch.theme)}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between border-2 p-4 transition-all duration-200",
                    isSelected
                      ? "border-ink bg-paper -translate-y-1 shadow-md"
                      : "border-line hover:border-ink bg-bg hover:-translate-y-0.5",
                  )}
                >
                  <div>
                    {/* Swatch Preview Box */}
                    <div
                      className={cn(
                        "border-ink relative mb-3 flex h-20 w-full items-center justify-center border-2 p-3",
                        THEME_CONFIG[swatch.theme].bg,
                      )}
                    >
                      <span className="font-display text-lg font-black tracking-tight uppercase">
                        {swatch.theme}
                      </span>
                      {isSelected && (
                        <span className="bg-ink text-paper absolute top-1 right-1 px-1 font-mono text-[9px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Tokens & Values */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-mute">OKLCH:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(swatch.oklch);
                          }}
                          className="inline-flex items-center gap-1 font-bold hover:underline text-[11px]"
                          title="Copy OKLCH code"
                        >
                          {swatch.oklch}
                          <CopyIcon className="size-3 opacity-60" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-ink-mute">Hex / Var:</span>
                        <span className="text-ink font-semibold">
                          <code>{swatch.cssVar}</code> ({swatch.hex})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-ink-mute">Text Contrast:</span>
                        <span
                          className={cn(
                            "border px-1.5 py-0.5 text-[10px] font-bold",
                            swatch.textColor === "text-paper"
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper text-ink border-ink",
                          )}
                        >
                          {swatch.textColor === "text-paper" ? "Light / White" : "Dark / Ink"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-ink-mute">Source:</span>
                        <span className="text-ink-2 font-medium truncate max-w-[160px]" title={swatch.source}>
                          {swatch.source}
                        </span>
                      </div>
                    </div>

                    {/* Tint & Deep preview dots */}
                    <div className="border-line mt-3 flex items-center justify-between border-t pt-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="border-ink size-3 rounded-full border"
                          style={{ backgroundColor: swatch.tintHex }}
                        />
                        <span className="text-ink-mute">Tint</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="border-ink size-3 rounded-full border"
                          style={{ backgroundColor: swatch.deepHex }}
                        />
                        <span className="text-ink-mute">Deep</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-ink-mute border-line mt-3 border-t pt-2 text-xs leading-snug">
                    {swatch.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Live Component Preview for Selected Theme */}
          <div className="border-ink bg-paper mt-10 border-2 p-6 shadow-sm">
            <div className="border-line mb-6 flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="text-ink size-5" />
                <h3 className="font-mono text-sm font-bold tracking-wider uppercase">
                  Live Component Render with Theme:{" "}
                  <span className="underline">{selectedTheme}</span>
                </h3>
              </div>
              <span className="text-ink-mute font-mono text-xs">
                Class:{" "}
                <code className="bg-bg border-line border px-1.5 py-0.5">
                  {THEME_CONFIG[selectedTheme].bg}
                </code>
              </span>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Card Preview */}
              <div>
                <span className="text-mono-2xs text-ink-mute mb-2 block">
                  01. Standard Resource Card
                </span>
                <ResourceCardView
                  title={SAMPLE_RESOURCES_BY_THEME[selectedTheme].title}
                  subtitle={SAMPLE_RESOURCES_BY_THEME[selectedTheme].subtitle}
                  category={SAMPLE_RESOURCES_BY_THEME[selectedTheme].category}
                  description={SAMPLE_RESOURCES_BY_THEME[selectedTheme].description}
                  author={SAMPLE_RESOURCES_BY_THEME[selectedTheme].author}
                  stars={SAMPLE_RESOURCES_BY_THEME[selectedTheme].stars}
                  tags={SAMPLE_RESOURCES_BY_THEME[selectedTheme].tags}
                  url={SAMPLE_RESOURCES_BY_THEME[selectedTheme].url}
                  theme={selectedTheme}
                  showTags={true}
                  isBookmarked={isBookmarkedDemo}
                  onBookmarkClick={() => {
                    setIsBookmarkedDemo(!isBookmarkedDemo);
                    toast.info(isBookmarkedDemo ? "Removed demo bookmark" : "Added demo bookmark");
                  }}
                />
              </div>

              {/* Filter Pills & Interactive States */}
              <div className="space-y-6">
                <div>
                  <span className="text-mono-2xs text-ink-mute mb-2 block">
                    02. Filter Pills (Active & Inactive)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <DotButton
                      label={`${selectedTheme.toUpperCase()} ACTIVE`}
                      isActive={true}
                      theme={selectedTheme}
                    />
                    <DotButton label="INACTIVE PILL" isActive={false} theme={selectedTheme} />
                  </div>
                </div>

                <div>
                  <span className="text-mono-2xs text-ink-mute mb-2 block">
                    03. Category Section Divider
                  </span>
                  <div className="border-ink bg-bg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "border-ink size-3 rounded-full border",
                            THEME_CONFIG[selectedTheme].bg,
                          )}
                        />
                        <span className="font-mono text-xs font-bold tracking-wider uppercase">
                          {SAMPLE_RESOURCES_BY_THEME[selectedTheme].category}
                        </span>
                      </div>
                      <span className="text-ink-mute font-mono text-xs font-bold">12 ITEMS</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-mono-2xs text-ink-mute mb-2 block">
                    04. Chips & Micro Badges
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "border-ink border px-2.5 py-1 font-mono text-xs font-bold",
                        THEME_CONFIG[selectedTheme].bg,
                      )}
                    >
                      Primary Badge
                    </span>
                    <span
                      className={cn(
                        "border-ink border px-2.5 py-1 font-mono text-xs font-bold",
                        THEME_CONFIG[selectedTheme].soft,
                      )}
                    >
                      Tint Soft Badge
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Specs Box */}
              <div className="border-ink bg-bg space-y-3 border-2 p-4 font-mono text-xs">
                <div className="border-line flex items-center justify-between border-b pb-2 font-bold">
                  <span>TOKEN SPECS</span>
                  <span>{selectedTheme.toUpperCase()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Class (.bg):</span>
                    <span className="font-bold">{THEME_CONFIG[selectedTheme].bg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Border:</span>
                    <span className="font-bold">{THEME_CONFIG[selectedTheme].border}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Dot Active:</span>
                    <span className="font-bold">{THEME_CONFIG[selectedTheme].dotActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Soft Tint:</span>
                    <span className="font-bold">{THEME_CONFIG[selectedTheme].soft}</span>
                  </div>
                </div>
                <div className="border-line border-t pt-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full font-mono text-xs"
                    onClick={() =>
                      handleCopy(JSON.stringify(THEME_CONFIG[selectedTheme], null, 2))
                    }
                  >
                    <CopyIcon className="mr-2 size-4" />
                    Copy Theme Config JSON
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: CATEGORY SIMULATOR */}
        {/* ========================================================================= */}
        <section id="simulator" className="scroll-mt-24">
          <div className="cat-divider border-ink border-b-2 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-ink text-paper flex size-8 items-center justify-center font-mono text-sm font-bold">
                03
              </span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight uppercase sm:text-3xl">
                  Interactive Category Color Simulator
                </h2>
                <p className="text-ink-mute font-mono text-xs tracking-wider uppercase">
                  Deterministic hash distribution mapping database categories across the 8 color
                  themes
                </p>
              </div>
            </div>
          </div>

          <div className="border-ink bg-paper mt-8 border-2 p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-mono text-sm font-bold tracking-wider uppercase">
                  Test Category Color Assignment
                </h3>
                <p className="text-ink-mute mt-1 text-xs">
                  Click any database category to see its assigned theme and live card
                  representation.
                </p>
              </div>
              <div className="bg-bg border-ink border px-3 py-1.5 font-mono text-xs">
                Active Category: <strong className="text-ink">{simulatedCategory}</strong> → Theme:{" "}
                <strong className="uppercase">{simulatedTheme}</strong>
              </div>
            </div>

            {/* Category Pills Matrix */}
            <div className="border-line flex flex-wrap gap-2 border-b pb-6">
              {categories.map((cat, idx) => {
                const theme = getCategoryTheme(cat.name, "resource", idx, categoryNames);
                const isSelected = simulatedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id || cat.slug || idx}
                    type="button"
                    onClick={() => setSimulatedCategory(cat.name)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 border-2 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all",
                      isSelected
                        ? "border-ink scale-105 shadow-xs"
                        : "bg-bg hover:border-line border-transparent",
                      isSelected && THEME_CONFIG[theme].bg,
                    )}
                  >
                    <span
                      className={cn(
                        "border-ink size-2.5 rounded-full border",
                        THEME_CONFIG[theme].bg,
                      )}
                    />
                    <span>{cat.name}</span>
                    {cat.resourceCount !== undefined && (
                      <span className="text-[10px] opacity-60">({cat.resourceCount})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Results Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <span className="text-mono-2xs text-ink-mute">Assigned Theme Card</span>
                <ResourceCardView
                  title={`${simulatedCategory} Resource Sample`}
                  subtitle={`Cataloged under ${simulatedCategory}`}
                  category={simulatedCategory}
                  description={`This card demonstrates how items in "${simulatedCategory}" render with theme "${simulatedTheme}". Text colors, dots, and hover states adapt automatically.`}
                  author="Curator Team"
                  stars={14200}
                  tags={[simulatedCategory, "Curated", "v2.0"]}
                  showTags={true}
                  url="#"
                />
              </div>

              <div className="space-y-4 font-mono text-xs">
                <span className="text-mono-2xs text-ink-mute">Category Distribution Stats</span>
                <div className="border-ink bg-bg space-y-2 border-2 p-4">
                  <div className="border-line flex justify-between border-b pb-2 font-bold">
                    <span>PALETTE BALANCE</span>
                    <span>{categories.length} CATEGORIES</span>
                  </div>
                  {THEMES.map((t) => {
                    const count = categories.filter(
                      (c, idx) => getCategoryTheme(c.name, "resource", idx, categoryNames) === t,
                    ).length;
                    return (
                      <div key={t} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 rounded-full", THEME_CONFIG[t].bg)} />
                          <span className="capitalize">{t}:</span>
                        </div>
                        <span className="font-bold">
                          {count} {count === 1 ? "cat" : "cats"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <span className="text-mono-2xs text-ink-mute">Theme Integration Rule</span>
                <div className="border-ink bg-bg space-y-3 border-2 p-4">
                  <p className="text-ink-2 leading-relaxed">
                    Categories map deterministically to themes via <code>getCategoryTheme()</code>.
                    No manual database migration is required to maintain harmonious color
                    distribution across all pages.
                  </p>
                  <div className="bg-paper border-line border p-2 text-[11px]">
                    <code>const theme = getCategoryTheme(&quot;{simulatedCategory}&quot;);</code>
                    <br />
                    <code>{`// Returns: "${simulatedTheme}"`}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: ATOMIC UI COMPONENT SANDBOX */}
        {/* ========================================================================= */}
        <section id="sandbox" className="scroll-mt-24">
          <div className="cat-divider border-ink border-b-2 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-ink text-paper flex size-8 items-center justify-center font-mono text-sm font-bold">
                04
              </span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight uppercase sm:text-3xl">
                  Atomic UI Component Sandbox
                </h2>
                <p className="text-ink-mute font-mono text-xs tracking-wider uppercase">
                  Buttons · Badges · Inputs · Shortcuts · Modals · Tooltips
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {/* Button Matrix */}
            <div className="border-ink bg-paper border-2 p-6 shadow-sm">
              <h3 className="border-line mb-6 border-b pb-3 font-mono text-sm font-bold tracking-wider uppercase">
                Button Variants & Sizes
              </h3>

              <div className="space-y-6">
                {/* Variants */}
                <div className="space-y-2">
                  <span className="text-mono-2xs text-ink-mute">
                    Button Variants (size=&quot;default&quot;)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">Default Ink</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link Variant</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <span className="text-mono-2xs text-ink-mute">
                    Button Sizes (variant=&quot;default&quot;)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="lg">Large (lg)</Button>
                    <Button size="default">Default</Button>
                    <Button size="sm">Small (sm)</Button>
                    <Button size="xs">Extra Small (xs)</Button>
                  </div>
                </div>

                {/* Icon Buttons */}
                <div className="space-y-2">
                  <span className="text-mono-2xs text-ink-mute">Icon Button Sizes</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="icon-lg" variant="outline" title="Icon LG">
                      <BookmarkSimpleIcon className="size-5" />
                    </Button>
                    <Button size="icon" variant="outline" title="Icon Default">
                      <BookmarkSimpleIcon className="size-4" />
                    </Button>
                    <Button size="icon-sm" variant="outline" title="Icon SM">
                      <BookmarkSimpleIcon className="size-3.5" />
                    </Button>
                    <Button size="icon-xs" variant="outline" title="Icon XS">
                      <BookmarkSimpleIcon className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs, Search & Modals */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Form Controls */}
              <div className="border-ink bg-paper space-y-6 border-2 p-6 shadow-sm">
                <h3 className="border-line border-b pb-3 font-mono text-sm font-bold tracking-wider uppercase">
                  Search & Inputs
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-mono-2xs text-ink">Brutalist Search Input</label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="text-ink absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        value={sampleQuery}
                        onChange={(e) => setSampleQuery(e.target.value)}
                        placeholder="Search resources, tags, authors..."
                        className="pr-9 pl-9"
                      />
                      {sampleQuery && (
                        <button
                          type="button"
                          onClick={() => setSampleQuery("")}
                          className="text-ink-mute hover:text-ink absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                        >
                          <XIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-mono-xs text-ink-mute">Keyboard Shortcut Badges:</span>
                    <div className="flex items-center gap-1.5">
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                      <span className="text-ink-mute mx-1 text-xs">or</span>
                      <Kbd>Esc</Kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog & Interactive Modals */}
              <div className="border-ink bg-paper space-y-6 border-2 p-6 shadow-sm">
                <h3 className="border-line border-b pb-3 font-mono text-sm font-bold tracking-wider uppercase">
                  Dialogs & Tooltips
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" className="font-mono text-xs uppercase">
                          <EyeIcon className="mr-2 size-4" />
                          Open Demo Dialog
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-ink bg-paper border-2">
                        <DialogHeader>
                          <DialogTitle className="font-display text-2xl font-black uppercase">
                            Brutalist Modal Dialog
                          </DialogTitle>
                          <DialogDescription className="text-ink-2 font-sans text-sm">
                            This modal adheres to the high-contrast hard-shadow design tokens of
                            Syntax Stash.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="border-ink bg-bg my-2 border p-4 font-mono text-xs">
                          <code>
                            All modals support full keyboard accessibility (Esc, Tab focus
                            trapping).
                          </code>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="default"
                            onClick={() => toast.success("Action confirmed!")}
                          >
                            Confirm Action
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <LightningIcon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>High-contrast brutalist tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="border-line bg-bg text-ink-mute border p-3 font-mono text-xs">
                    Tooltips automatically invert contrast to provide maximum legibility across
                    different background colors.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: CONTRAST & ACCESSIBILITY AUDIT */}
        {/* ========================================================================= */}
        <section id="contrast" className="scroll-mt-24">
          <div className="cat-divider border-ink border-b-2 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-ink text-paper flex size-8 items-center justify-center font-mono text-sm font-bold">
                05
              </span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight uppercase sm:text-3xl">
                  Contrast & WCAG Accessibility Audit
                </h2>
                <p className="text-ink-mute font-mono text-xs tracking-wider uppercase">
                  WCAG 2.1 AA / AAA verification for all 8 background tokens
                </p>
              </div>
            </div>
          </div>

          <div className="border-ink bg-paper mt-8 overflow-x-auto border-2 p-6 shadow-sm">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="border-ink bg-bg border-b-2">
                  <th className="p-3 uppercase">Theme Name</th>
                  <th className="p-3 uppercase">OKLCH Token</th>
                  <th className="p-3 uppercase">Hex</th>
                  <th className="p-3 uppercase">Foreground Text</th>
                  <th className="p-3 uppercase">Ratio</th>
                  <th className="p-3 uppercase">WCAG Status</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {[
                  {
                    theme: "Red (Cardinal Red)",
                    oklch: "oklch(42% 0.21 27)",
                    hex: "#9b111e",
                    text: "oklch(95.5% 0.012 85) (Paper)",
                    ratio: "7.8:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Orange (Amber)",
                    oklch: "oklch(75% 0.16 70)",
                    hex: "#e8a52b",
                    text: "oklch(15.5% 0.015 65) (Ink)",
                    ratio: "8.4:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Yellow (Lemon Sun)",
                    oklch: "oklch(93.5% 0.16 102)",
                    hex: "#fff064",
                    text: "oklch(15.5% 0.015 65) (Ink)",
                    ratio: "13.6:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Green (Fresh Grass)",
                    oklch: "oklch(76% 0.20 135)",
                    hex: "#88cb02",
                    text: "oklch(15.5% 0.015 65) (Ink)",
                    ratio: "8.8:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Cyan (Blue Slush)",
                    oklch: "oklch(84% 0.09 232)",
                    hex: "#9dd6fa",
                    text: "oklch(15.5% 0.015 65) (Ink)",
                    ratio: "10.8:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Blue (Cobalt)",
                    oklch: "oklch(42% 0.19 265)",
                    hex: "#2a47b8",
                    text: "oklch(95.5% 0.012 85) (Paper)",
                    ratio: "8.9:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Purple (Berry Plum)",
                    oklch: "oklch(43% 0.11 348)",
                    hex: "#683557",
                    text: "oklch(95.5% 0.012 85) (Paper)",
                    ratio: "8.7:1",
                    status: "AAA Pass",
                  },
                  {
                    theme: "Pink (Lilac)",
                    oklch: "oklch(75% 0.14 310)",
                    hex: "#c9a4f0",
                    text: "oklch(15.5% 0.015 65) (Ink)",
                    ratio: "8.1:1",
                    status: "AAA Pass",
                  },
                ].map((row) => (
                  <tr key={row.theme} className="hover:bg-bg/50">
                    <td className="p-3 font-bold">{row.theme}</td>
                    <td className="p-3">
                      <code>{row.oklch}</code>
                    </td>
                    <td className="p-3">
                      <code>{row.hex}</code>
                    </td>
                    <td className="p-3">{row.text}</td>
                    <td className="p-3 font-bold">{row.ratio}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircleIcon weight="fill" className="size-4" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
