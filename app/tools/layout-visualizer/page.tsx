"use client";

import { Check, Copy, LayoutGrid } from "lucide-react";
import { useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

type DisplayType = "flex" | "grid";
type FlexDirection = "row" | "col";
type JustifyContent = "start" | "center" | "end" | "space-between";
type AlignItems = "start" | "center" | "end" | "stretch";
type GapSize = "2" | "4" | "8";

function getDisplayClass(display: DisplayType): string {
  return display === "flex" ? "flex" : "grid";
}

function getFlexDirectionClass(direction: FlexDirection): string {
  if (direction === "row") return "flex-row";
  if (direction === "col") return "flex-col";
  return "";
}

function getJustifyContentClass(justify: JustifyContent): string {
  if (justify === "start") return "justify-start";
  if (justify === "center") return "justify-center";
  if (justify === "end") return "justify-end";
  if (justify === "space-between") return "justify-between";
  return "";
}

function getAlignItemsClass(align: AlignItems): string {
  if (align === "start") return "items-start";
  if (align === "center") return "items-center";
  if (align === "end") return "items-end";
  if (align === "stretch") return "items-stretch";
  return "";
}

function getGapClass(gap: GapSize): string {
  if (gap === "2") return "gap-2";
  if (gap === "4") return "gap-4";
  if (gap === "8") return "gap-8";
  return "";
}

export default function LayoutVisualizerPage() {
  const [display, setDisplay] = useState<DisplayType>("flex");
  const [flexDirection, setFlexDirection] = useState<FlexDirection>("row");
  const [justifyContent, setJustifyContent] = useState<JustifyContent>("start");
  const [alignItems, setAlignItems] = useState<AlignItems>("center");
  const [gap, setGap] = useState<GapSize>("4");

  const containerClasses = cn(
    getDisplayClass(display),
    getFlexDirectionClass(flexDirection),
    getJustifyContentClass(justifyContent),
    getAlignItemsClass(alignItems),
    getGapClass(gap),
  );

  const tailwindClassString =
    `${getDisplayClass(display)} ${getFlexDirectionClass(flexDirection)} ${getJustifyContentClass(justifyContent)} ${getAlignItemsClass(alignItems)} ${getGapClass(gap)}`.trim();

  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={LayoutGrid}
      title="Layout Visualizer"
      highlight="CSS"
      description="Interactively explore Tailwind Flex and Grid layout properties and see the code in real-time."
    >
      <div className="space-y-8">
        {/* Controls and Preview Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Controls */}
          <div className="space-y-6 lg:col-span-1">
            {/* Display */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-semibold">Display</Label>
              <Select value={display} onValueChange={(value) => setDisplay(value as DisplayType)}>
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex">flex</SelectItem>
                  <SelectItem value="grid">grid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Flex Direction */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-semibold">Direction</Label>
              <Select
                value={flexDirection}
                onValueChange={(value) => setFlexDirection(value as FlexDirection)}
              >
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">row</SelectItem>
                  <SelectItem value="col">column</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Justify Content */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-semibold">Justify Content</Label>
              <Select
                value={justifyContent}
                onValueChange={(value) => setJustifyContent(value as JustifyContent)}
              >
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">start</SelectItem>
                  <SelectItem value="center">center</SelectItem>
                  <SelectItem value="end">end</SelectItem>
                  <SelectItem value="space-between">space-between</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Align Items */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-semibold">Align Items</Label>
              <Select
                value={alignItems}
                onValueChange={(value) => setAlignItems(value as AlignItems)}
              >
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">start</SelectItem>
                  <SelectItem value="center">center</SelectItem>
                  <SelectItem value="end">end</SelectItem>
                  <SelectItem value="stretch">stretch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gap */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-semibold">Gap</Label>
              <Select value={gap} onValueChange={(value) => setGap(value as GapSize)}>
                <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 (0.5rem)</SelectItem>
                  <SelectItem value="4">4 (1rem)</SelectItem>
                  <SelectItem value="8">8 (2rem)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-3 lg:col-span-2">
            <Label className="text-foreground text-sm font-semibold">Preview</Label>
            <Card className="bg-background border-border border-2 border-dashed">
              <CardContent className="p-6">
                <div className={cn("min-h-100 w-full rounded-lg", containerClasses)}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={
                        "text-background bg-secondary flex h-20 w-20 shrink-0 items-center justify-center rounded-lg text-2xl font-bold transition-all"
                      }
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Code Block */}
        <div className="space-y-3">
          <Label className="text-foreground text-sm font-semibold">Tailwind Classes</Label>
          <div className="bg-background border-border space-y-3 rounded-lg border p-4">
            <pre className="text-primary overflow-x-auto font-mono text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
              {tailwindClassString || "(select properties to generate classes)"}
            </pre>
            <Button
              onClick={() => copy(tailwindClassString)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!tailwindClassString}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Reference Section */}
        <div className="bg-muted/30 border-border space-y-3 rounded-lg border p-4">
          <h4 className="text-foreground text-sm font-semibold">Tailwind Layout Reference</h4>
          <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
            <div className="space-y-2">
              <p>
                <span className="text-foreground font-semibold">Flex vs Grid:</span> Flex arranges
                items in a line, Grid arranges items in rows and columns.
              </p>
              <p>
                <span className="text-foreground font-semibold">Direction:</span> Controls how flex
                items flow (horizontal or vertical).
              </p>
              <p>
                <span className="text-foreground font-semibold">Justify:</span> Aligns items along
                the main axis (direction of flex flow).
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="text-foreground font-semibold">Align:</span> Aligns items along the
                cross axis (perpendicular to flex direction).
              </p>
              <p>
                <span className="text-foreground font-semibold">Gap:</span> Creates space between
                items without using margin.
              </p>
              <p>
                <span className="text-foreground font-semibold">Copy the classes</span> to use them
                in your Tailwind projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
