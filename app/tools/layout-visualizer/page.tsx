"use client";

import { useState } from "react";

import {
  alignOptions,
  directionOptions,
  displayOptions,
  gapOptions,
  justifyOptions,
} from "@/app/tools/layout-visualizer/data";
import {
  getAlignItemsClass,
  getDisplayClass,
  getFlexDirectionClass,
  getGapClass,
  getJustifyContentClass,
} from "@/app/tools/layout-visualizer/helpers";
import {
  AlignItems,
  DisplayType,
  FlexDirection,
  GapSize,
  JustifyContent,
} from "@/app/tools/layout-visualizer/types";
import { ToolLayout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

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

  const tool = internalTools.find((t) => t.url === "/tools/layout-visualizer");
  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Controls and Preview Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Controls */}
          <div className="space-y-6 lg:col-span-1">
            <SelectField
              label="Display"
              value={display}
              onValueChange={(v) => setDisplay(v as DisplayType)}
              options={displayOptions}
            />

            <SelectField
              label="Direction"
              value={flexDirection}
              onValueChange={(v) => setFlexDirection(v as FlexDirection)}
              options={directionOptions}
            />
            <SelectField
              label="Justify Content"
              value={justifyContent}
              onValueChange={(v) => setJustifyContent(v as JustifyContent)}
              options={justifyOptions}
            />
            <SelectField
              label="Align Items"
              value={alignItems}
              onValueChange={(v) => setAlignItems(v as AlignItems)}
              options={alignOptions}
            />
            <SelectField
              label="Gap"
              value={gap}
              onValueChange={(v) => setGap(v as GapSize)}
              options={gapOptions}
            />
          </div>

          {/* Preview */}
          <div className="space-y-3 lg:col-span-2">
            <Label>Preview</Label>
            <Card className="bg-background border-border border-2 border-dashed">
              <CardContent className="p-6">
                <div className={cn("min-h-100 w-full rounded-lg", containerClasses)}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={
                        "bg-secondary dark:bg-primary dark:text-background border-foreground dark:border-foreground flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border text-2xl font-bold transition-all"
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
            <CopyButton value={tailwindClassString} disabled={!tailwindClassString} />
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
