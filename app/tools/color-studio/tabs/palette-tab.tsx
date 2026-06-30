"use client";

import { BracketsCurlyIcon } from "@phosphor-icons/react";

import { COLOR_PALETTES } from "@/app/tools/color-studio/palette-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function PaletteTab() {
  return (
    <div className="space-y-12">
      {/* Palette Gallery Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COLOR_PALETTES.map((palette, idx) => {
          const cssLines = palette.colors
            .map((c) => `  --${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
            .join("\n");

          const tailwindLines = palette.colors
            .map((c) => `  --color-${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
            .join("\n");

          const combinedCode = `:root {\n${cssLines}\n}\n\n@theme inline {\n${tailwindLines}\n}`;

          return (
            <Card
              key={idx}
              className="hover:ring-muted-foreground transform ring-2 duration-200 hover:-translate-y-1 hover:scale-100"
            >
              <CardHeader className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{palette.name}</h3>

                {/* Export Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-bold">
                      <BracketsCurlyIcon weight="bold" />
                      Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="text-mono-sm">
                        Palette name: &quot;{palette.name}&quot;
                      </DialogTitle>
                    </DialogHeader>
                    <div className="bg-card overflow-hidden border-2">
                      <div className="bg-muted/30 flex items-center justify-between border-b-2 px-4 py-2">
                        <h4 className="text-mono-xs">{"//"} Combined CSS Properties</h4>
                        <CopyButton iconOnly textToCopy={combinedCode} />
                      </div>
                      <div className="max-h-[50vh] overflow-x-auto p-4">
                        <pre className="text-foreground font-mono text-xs leading-relaxed">
                          <code>{combinedCode}</code>
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              {/* Dynamic Bento Box Layout inside the Card */}
              <CardContent className="grid flex-1 grid-cols-3 grid-rows-3 gap-1.5">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-border/30 flex min-h-24 flex-col justify-between rounded-none border p-3 font-mono transition-all duration-100",
                      color.textColor === "black" ? "text-black" : "text-white",
                      color.colSpan,
                    )}
                    style={{
                      backgroundColor: color.hex,
                    }}
                  >
                    <div className="text-sm font-bold tracking-tight">{color.name}</div>
                    <div className="mt-6 font-mono text-xs font-bold opacity-80">{color.hex}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
