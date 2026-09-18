/* eslint-disable perfectionist/sort-arrays */
"use client";

import {
  CheckIcon,
  CopyIcon,
  CursorClickIcon,
  PaintBrushIcon,
  RowsIcon,
  SlidersIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { toast } from "sonner";

import { DotButton } from "@/components/dot-button";
import { StatusBadge } from "@/components/status-badge/status-badge";
import { FieldCheckmark } from "@/components/submissions/field-checkmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadButton } from "@/components/ui/download-button";
import { InputField } from "@/components/ui/input-field";
import { Kbd } from "@/components/ui/kbd";
import { SearchInput } from "@/components/ui/search-input";
import { SelectField } from "@/components/ui/select-field";
import { SliderField } from "@/components/ui/slider-field";
import { SwitchField } from "@/components/ui/switch-field";

interface TriadColorToken {
  cssVar: string;
  description: string;
  name: string;
  oklch: string;
  role: string;
}

const BRAND_TRIAD: TriadColorToken[] = [
  {
    cssVar: "--brand-orange",
    description: "Primary brand accent, main CTAs & focus indicators",
    name: "Brand Orange",
    oklch: "oklch(0.7674 0.1487 76.8)",
    role: "Primary",
  },
  {
    cssVar: "--brand-purple",
    description: "Secondary brand accent, category pills & active filter tags",
    name: "Brand Purple",
    oklch: "oklch(0.7788 0.1126 306.2)",
    role: "Secondary",
  },
  {
    cssVar: "--brand-green",
    description: "Accent color, verified indicators & active status highlights",
    name: "Brand Green",
    oklch: "oklch(0.6637 0.1739 136.2)",
    role: "Accent",
  },
];

const NEUTRAL_TOKENS = [
  { cssVar: "--bg", name: "Canvas", role: "Background", value: "#121212" },
  { cssVar: "--card", name: "Card / Paper", role: "Surface 1", value: "#18181b" },
  { cssVar: "--muted", name: "Subtle Surface", role: "Surface 2", value: "#27272a" },
  {
    cssVar: "--line",
    name: "Border Line",
    role: "Line / Stroke",
    value: "rgba(255, 255, 255, 0.08)",
  },
  { cssVar: "--ink", name: "Ink / Foreground", role: "Text Primary", value: "#f4f4f5" },
  { cssVar: "--ink-mute", name: "Muted Text", role: "Text Mute", value: "#a1a1aa" },
];

export function DesignSystemShowcase() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchVal, setSearchVal] = useState("");
  const [inputVal, setInputVal] = useState("https://syntaxstash.dev");
  const [selectVal, setSelectVal] = useState("option-1");
  const [switchState, setSwitchState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [sliderVal, setSliderVal] = useState(72);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}: ${text}`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen py-20 font-mono">
      <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-line border-b-[1.5px] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary font-mono text-[10px] uppercase">
                  v1.4 Design System
                </Badge>
              </div>
              <h1 className="text-foreground mt-2 text-2xl font-black tracking-tight uppercase sm:text-3xl">
                Syntax Stash Design System
              </h1>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                Three-Color Triad, neutral surfaces, typography scale, and core UI controls.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </div>
          </div>
        </div>

        {/* Section 1: Three-Color Triad & Neutral Tokens */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <PaintBrushIcon className="text-primary size-5" />
            <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Three-Color Triad
            </h2>
          </div>

          {/* 3 Brand Colors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BRAND_TRIAD.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => copyToClipboard(color.oklch, color.name)}
                className="border-line bg-card hover:border-line-2 group flex flex-col justify-between overflow-hidden rounded-xl border-[1.5px] p-4 text-left transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase">{color.name}</span>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {color.role}
                    </Badge>
                  </div>
                  <div
                    className="my-3 h-10 w-full rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: color.oklch }}
                  />
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {color.description}
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-foreground border-line/60 mt-4 flex items-center justify-between border-t pt-3 text-[11px]">
                  <code>{color.cssVar}</code>
                  <CopyIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>

          {/* Core Neutral / System Tokens */}
          <div className="border-line/60 grid grid-cols-2 gap-3 border-t pt-3 sm:grid-cols-3 md:grid-cols-6">
            {NEUTRAL_TOKENS.map((token) => (
              <button
                key={token.name}
                type="button"
                onClick={() => copyToClipboard(token.cssVar, token.name)}
                className="border-line bg-surface/50 hover:border-line-2 group flex flex-col justify-between rounded-lg border p-2.5 text-left text-xs transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                    {token.name}
                  </span>
                  <span
                    className="size-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: token.value }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-foreground">{token.cssVar}</span>
                  <CopyIcon className="size-3 opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TextTIcon className="text-primary size-5" />
            <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Typography Scale
            </h2>
          </div>

          <div className="border-line bg-card divide-line/60 divide-y rounded-xl border-[1.5px]">
            <div className="flex flex-wrap items-baseline justify-between p-4">
              <span className="text-2xl font-black uppercase sm:text-3xl">Display 3XL</span>
              <code className="text-muted-foreground text-xs">text-3xl / font-black / mono</code>
            </div>
            <div className="flex flex-wrap items-baseline justify-between p-4">
              <span className="text-xl font-bold uppercase sm:text-2xl">Header 2XL</span>
              <code className="text-muted-foreground text-xs">text-2xl / font-bold / mono</code>
            </div>
            <div className="flex flex-wrap items-baseline justify-between p-4">
              <span className="text-base font-bold uppercase sm:text-lg">Section Title XL</span>
              <code className="text-muted-foreground text-xs">text-lg / font-bold / mono</code>
            </div>
            <div className="flex flex-wrap items-baseline justify-between p-4">
              <span className="text-sm font-semibold">Body Regular / UI Text</span>
              <code className="text-muted-foreground text-xs">text-sm / font-normal / mono</code>
            </div>
            <div className="flex flex-wrap items-baseline justify-between p-4">
              <span className="text-muted-foreground text-xs uppercase">Caption / Meta Label</span>
              <code className="text-muted-foreground text-xs">text-xs / font-mono</code>
            </div>
          </div>
        </section>

        {/* Section 3: Buttons & Interactive Controls */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CursorClickIcon className="text-primary size-5" />
            <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Buttons & Action Controls
            </h2>
          </div>

          <div className="border-line bg-card space-y-6 rounded-xl border-[1.5px] p-6">
            {/* Button Variants */}
            <div>
              <span className="text-muted-foreground text-xs font-bold uppercase">Variants</span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant="default">Primary Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="border-line/60 border-t pt-4">
              <span className="text-muted-foreground text-xs font-bold uppercase">
                Sizes & Actions
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button size="lg">Large (lg)</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small (sm)</Button>
                <Button size="xs">Extra Small (xs)</Button>
                <CopyButton textToCopy="Syntax Stash Code" size="sm" />
                <DownloadButton
                  size="sm"
                  label="Download"
                  onClick={() => toast.success("Downloaded sample file.")}
                />
              </div>
            </div>

            {/* Filter Pills & Status Indicators */}
            <div className="border-line/60 border-t pt-4">
              <span className="text-muted-foreground text-xs font-bold uppercase">
                Filter Pills & Status Indicators
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <DotButton
                  isActive={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                  label="All Resources"
                />
                <DotButton
                  isActive={activeFilter === "snippets"}
                  onClick={() => setActiveFilter("snippets")}
                  label="Snippets"
                  badgeText="14"
                />
                <DotButton
                  isActive={activeFilter === "tools"}
                  onClick={() => setActiveFilter("tools")}
                  label="Developer Tools"
                  badgeText="8"
                />
                <StatusBadge status="ready" />
                <StatusBadge status="provisioning" />
                <StatusBadge status="stopped" />
                <StatusBadge status="error" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Form Controls */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <SlidersIcon className="text-primary size-5" />
            <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Form Controls & Inputs
            </h2>
          </div>

          <div className="border-line bg-card grid grid-cols-1 gap-6 rounded-xl border-[1.5px] p-6 sm:grid-cols-2">
            {/* Input with checkmark */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase">Website URL</span>
                <FieldCheckmark checked={Boolean(inputVal.trim())} />
              </div>
              <InputField
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="https://syntaxstash.dev"
                className="font-mono text-xs"
              />
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase">Search Field</span>
              <SearchInput
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onClear={() => setSearchVal("")}
                placeholder="Search tools, categories..."
                className="font-mono text-xs"
              />
            </div>

            {/* Select Field */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase">Select Field</span>
              <SelectField
                value={selectVal}
                onValueChange={setSelectVal}
                options={[
                  { label: "Option One (Featured)", value: "option-1" },
                  { label: "Option Two (Standard)", value: "option-2" },
                  { label: "Option Three (Experimental)", value: "option-3" },
                ]}
                triggerClassName="font-mono text-xs"
              />
            </div>

            {/* Slider Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase">Slider Control</span>
                <span className="text-muted-foreground text-xs">{sliderVal}%</span>
              </div>
              <SliderField
                value={[sliderVal]}
                onValueChange={(val) => setSliderVal(val[0] ?? 0)}
                max={100}
                step={1}
              />
            </div>

            {/* Switch & Checkbox */}
            <div className="border-line/60 col-span-1 flex flex-wrap items-center gap-6 border-t pt-4 sm:col-span-2">
              <SwitchField
                checked={switchState}
                onCheckedChange={setSwitchState}
                label="Auto-Sync Enabled"
              />
              <CheckboxField
                checked={checkboxState}
                onCheckedChange={(checked) => setCheckboxState(Boolean(checked))}
                label="Verified Resource Filter"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Neo-Brutalist Surface Container */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center gap-2">
            <RowsIcon className="text-primary size-5" />
            <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Container / Surface Example
            </h2>
          </div>

          <div className="border-line bg-surface/30 rounded-2xl border-[1.5px] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary size-4" weight="bold" />
                <span className="text-xs font-bold uppercase">Container Surface (.bg-surface)</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                Card
              </Badge>
            </div>
            <p className="text-muted-foreground mt-3 font-mono text-xs leading-relaxed">
              Standard bordered panel with 1.5px boundary token, mono hierarchy, responsive padding,
              and high-contrast dark surface adaptation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
