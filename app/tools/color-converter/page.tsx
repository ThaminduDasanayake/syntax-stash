"use client";

import { Check, Copy, Palette } from "lucide-react";
import { useMemo, useState } from "react";

import {
  formatDecimalRgb,
  formatHsl,
  formatLab,
  formatLch,
  formatOklab,
  formatOklch,
  formatRgb,
  parseColor,
} from "@/app/tools/color-converter/formatters";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function ColorConverterPage() {
  const [inputFormat, setInputFormat] = useState("HEX");
  const [inputValue, setInputValue] = useState("#3b82f6");

  const { copiedItem, copy } = useCopyToClipboard();

  // Derive all formats dynamically
  const { preview, results, isValid } = useMemo(() => {
    try {
      const c = parseColor(inputFormat, inputValue);
      return {
        preview: c.hex(),
        isValid: true,
        results: [
          { id: "HEX", label: "HEX", value: c.hex() },
          { id: "RGB", label: "RGB", value: formatRgb(c) },
          { id: "DEC_RGB", label: "Decimal RGB", value: formatDecimalRgb(c) },
          { id: "HSL", label: "HSL", value: formatHsl(c) },
          { id: "LAB", label: "LAB", value: formatLab(c) },
          { id: "LCH", label: "LCH", value: formatLch(c) },
          { id: "OKLAB", label: "OKLAB", value: formatOklab(c) },
          { id: "OKLCH", label: "OKLCH", value: formatOklch(c) },
        ],
      };
    } catch {
      return {
        preview: "transparent",
        isValid: false,
        results: [],
      };
    }
  }, [inputFormat, inputValue]);

  const inputOptions = ["HEX", "RGB", "DEC_RGB", "HSL", "LAB", "LCH", "OKLAB", "OKLCH"];

  const placeholders: Record<string, string> = {
    HEX: "#3b82f6",
    RGB: "rgb(59, 130, 246)",
    DEC_RGB: "rgb(0.2314, 0.5098, 0.9647)",
    HSL: "hsl(217.2, 91.2%, 59.8%)",
    LAB: "lab(55.63 17.54 -64.42)",
    LCH: "lch(55.63 66.77 285.2)",
    OKLAB: "oklab(0.6231 -0.0332 -0.1851)",
    OKLCH: "oklch(0.6231 0.188 259.8)",
  };

  const handleFormatChange = (newFormat: string | null) => {
    if (!newFormat) return;

    setInputFormat(newFormat);
    if (isValid) {
      const match = results.find((r) => r.id === newFormat);
      if (match) setInputValue(match.value);
    }
  };

  return (
    <ToolLayout
      icon={Palette}
      title="Colour Converter"
      highlight="Colour"
      description="Convert between colour formats instantly."
    >
      <div className="space-y-10">
        {/* Top Control Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Color Preview Square */}
          <div
            className="border-border/50 h-12 w-12 shrink-0 rounded-xl border-2 shadow-sm transition-colors duration-200 md:h-20 md:w-20"
            style={{ backgroundColor: preview }}
          />

          {/* Inputs */}
          <div className="flex w-full justify-between gap-6">
            <div className="w-2/5 space-y-2">
              <Label className="text-foreground font-semibold">Input Format</Label>
              <Select value={inputFormat} onValueChange={handleFormatChange}>
                <SelectTrigger className="bg-background focus:ring-primary w-full font-mono">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {inputOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="font-mono">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <Label className="text-foreground font-semibold">Value</Label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`bg-background border-border focus-visible:ring-primary/30 font-mono focus-visible:ring-1 ${
                  !isValid && inputValue ? "border-destructive text-destructive" : ""
                }`}
                placeholder={`e.g. ${placeholders[inputFormat] || "#000000"}`}
              />
              {!isValid && inputValue && (
                <p className="text-destructive text-xs">Invalid colour value</p>
              )}
            </div>
          </div>
        </div>

        {/* Formats List Section */}
        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold tracking-tight">All Formats</h3>

          {isValid ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {results.map((res) => (
                <Button
                  size="lg"
                  key={res.id}
                  onClick={() => copy(res.value, res.id)}
                  className="group bg-card border-border hover:border-primary/50 focus-visible:ring-primary/30 flex h-20 w-full flex-col items-center justify-between gap-2 border px-8 py-4 transition-colors focus-visible:ring-1 focus-visible:outline-none"
                >
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                        {res.label}
                      </span>
                      <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {copiedItem === res.id ? <Check className="text-emerald-400" /> : <Copy />}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-start font-mono text-sm break-all">
                      {res.value}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
              Enter a valid colour to see format conversions.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
