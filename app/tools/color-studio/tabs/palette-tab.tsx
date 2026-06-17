"use client";

import { BracketsCurlyIcon } from "@phosphor-icons/react";

import { COLOR_PALETTES, Colors } from "@/app/tools/color-studio/palette-data";
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

function BentoColorBlock({ color }: { color: Colors }) {
  return (
    <div
      className={cn(
        color.hex,
        color.textColor === "black" && "text-background",
        "flex min-h-20 flex-col justify-between p-3",
        color.colSpan,
      )}
      style={{
        backgroundColor: color.hex,
      }}
    >
      <div className="text-sm font-bold tracking-tight">{color.name}</div>
      <div className="mt-6 font-mono text-xs font-bold opacity-80">{color.hex}</div>
    </div>
  );
}

function ExportBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="bg-card overflow-hidden border-2">
      <div className="bg-muted/30 flex items-center justify-between border-b-2 px-4 py-2">
        <h4 className="text-console">
          {"//"} {title}
        </h4>
        <CopyButton iconOnly textToCopy={code} />
      </div>
      <div className="max-h-[50vh] overflow-x-auto p-4">
        <pre className="text-foreground font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function PaletteTab() {
  return (
    <div className="space-y-12">
      {/* Palette Gallery Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {COLOR_PALETTES.map((palette, idx) => {
          const cssLines = palette.colors
            .map((c) => {
              const varName = c.name.toLowerCase().replace(/\s+/g, "-");
              return `  --${varName}: ${c.hex};`;
            })
            .join("\n");

          const tailwindLines = palette.colors
            .map((c) => {
              const varName = c.name.toLowerCase().replace(/\s+/g, "-");
              return `  --color-${varName}: ${c.hex};`;
            })
            .join("\n");

          const combinedCode = `:root {\n${cssLines}\n}\n\n@theme inline {\n${tailwindLines}\n}`;

          return (
            <Card
              key={idx}
              className="hover:ring-muted-foreground transform ring-2 duration-200 hover:-translate-y-1 hover:scale-100"
            >
              <CardHeader className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">{palette.name}</h3>

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
                      <DialogTitle className="text-console-md">
                        Palette name: &quot;{palette.name}&quot;
                      </DialogTitle>
                    </DialogHeader>
                    <ExportBlock title="Combined CSS Properties" code={combinedCode} />
                  </DialogContent>
                </Dialog>
              </CardHeader>

              {/* Dynamic Bento Box Layout inside the Card */}
              <CardContent className="grid flex-1 grid-cols-3 gap-2">
                {palette.colors.map((color, i) => (
                  <BentoColorBlock key={i} color={color} />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
