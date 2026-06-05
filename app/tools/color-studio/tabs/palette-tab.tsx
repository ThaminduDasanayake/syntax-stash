"use client";

import { useMemo, useState } from "react";

import ColorSwatch from "@/app/tools/color-studio/color-swatch";
import {
  exportAsCssProperties,
  exportAsTailwindConfig,
  generatePalettes,
  type Palette as PaletteType,
} from "@/app/tools/color-studio/palette-harmonies";
import { ColorField } from "@/components/ui/color-field";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function PaletteSection({ palette }: { palette: PaletteType }) {
  return (
    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
      <p className="text-foreground mb-3 text-sm font-semibold">{palette.name}</p>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${palette.colors.length}, minmax(0, 1fr))` }}
      >
        {palette.colors.map((color, i) => (
          <ColorSwatch key={i} color={color} />
        ))}
      </div>
    </div>
  );
}

function ExportBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <h4 className="text-foreground font-mono text-sm font-semibold">{title}</h4>
        <CopyButton variant="ghost" textToCopy={code} />
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="text-muted-foreground font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function PaletteTab() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [colorName, setColorName] = useState("brand");

  const { palettes, isValid } = useMemo(() => {
    try {
      const p = generatePalettes(baseColor);
      return { palettes: p, isValid: true };
    } catch {
      return { palettes: [], isValid: false };
    }
  }, [baseColor]);

  const cssCode = useMemo(
    () => (isValid ? exportAsCssProperties(palettes, colorName) : ""),
    [palettes, colorName, isValid],
  );

  const tailwindCode = useMemo(
    () => (isValid ? exportAsTailwindConfig(palettes, colorName) : ""),
    [palettes, colorName, isValid],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <ColorField label="Base Color" value={baseColor} onValueChange={setBaseColor} />

        <InputField
          label="Variable name"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="brand"
        />

        {isValid && (
          <div
            className="ml-auto h-10 w-20 rounded-xl border shadow-sm"
            style={{ backgroundColor: baseColor }}
            title={baseColor}
          />
        )}
      </div>

      {!isValid && (
        <p className="text-destructive text-sm">
          Invalid color value. Enter a valid hex like #3b82f6.
        </p>
      )}

      {isValid && palettes.length > 0 && (
        <div className="space-y-4">
          {palettes.map((palette) => (
            <PaletteSection key={palette.type} palette={palette} />
          ))}
        </div>
      )}

      {isValid && (
        <div className="space-y-3">
          <Label>Export</Label>
          <Tabs defaultValue="css">
            <TabsList className="tab-list grid grid-cols-2">
              <TabsTrigger value="css" className="tab-trigger">
                CSS Variables
              </TabsTrigger>
              <TabsTrigger value="tailwind" className="tab-trigger">
                Tailwind Config
              </TabsTrigger>
            </TabsList>
            <TabsContent value="css" className="mt-3">
              <ExportBlock title=":root { ... }" code={cssCode} />
            </TabsContent>
            <TabsContent value="tailwind" className="mt-3">
              <ExportBlock title="tailwind.config.js" code={tailwindCode} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
