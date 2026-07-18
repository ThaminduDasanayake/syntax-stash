"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { PLACEHOLDER } from "@/app/tools/html-to-jsx/data";
import { convertHtmlToJsx, type ConvertOptions } from "@/app/tools/html-to-jsx/helpers";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SwitchField } from "@/components/ui/switch-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

function HtmlToJsxPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [componentName, setComponentName] = useState("MyComponent");
  const [asComponent, setAsComponent] = useState(true);
  const [selfCloseEmpty, setSelfCloseEmpty] = useState(true);

  const { error, output } = useMemo(() => {
    if (!input.trim()) return { error: null, output: "" };
    try {
      const opts: ConvertOptions = { asComponent, componentName, selfCloseEmpty };
      return { error: null, output: convertHtmlToJsx(input, opts) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Conversion failed", output: "" };
    }
  }, [asComponent, componentName, input, selfCloseEmpty]);

  const tool = internalTools.find((t) => t.slug === "html-to-jsx");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6">
        <TextareaGroup
          label="HTML input"
          value={input}
          containerClassName="flex-1 min-h-[400px]"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste HTML here..."
          action={
            <ClearButton
              size="sm"
              onClick={() => {
                setInput("");
              }}
              disabled={!input}
            />
          }
        />
        {error && <p className="text-destructive text-xs">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Label>Output mode</Label>
            <SwitchField
              label="Wrap in React component"
              checked={asComponent}
              onCheckedChange={setAsComponent}
            />

            <SwitchField
              label="Self-close empty elements"
              checked={selfCloseEmpty}
              onCheckedChange={setSelfCloseEmpty}
            />
          </div>

          <InputField
            label="Component name"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            disabled={!asComponent}
            className="text-sm"
            placeholder="MyComponent"
          />
        </div>

        <TextareaGroup
          label="JSX output"
          readOnly
          value={output}
          containerClassName="flex-1 min-h-[400px]"
          placeholder="JSX will appear here..."
          action={<CopyButton iconOnly textToCopy={output} disabled={!output} />}
        />

        <Card>
          <CardHeader className="font-semibold">What this does</CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-disc space-y-1 text-xs">
              <li>
                <span className="inline-flex flex-wrap items-center gap-0.5">
                  Renames reserved attributes:<span className="font-mono"> class</span>
                  <ArrowRightIcon /> <span className="font-mono">className</span>,
                  <span className="font-mono">for</span> <ArrowRightIcon />
                  <span className="font-mono">htmlFor</span>,
                  <span className="font-mono">tabindex</span> <ArrowRightIcon />
                  <span className="font-mono">tabIndex</span>, etc.
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-0.5">
                  Converts event handlers to camelCase (<span className="font-mono">onclick</span>
                  <ArrowRightIcon />
                  <span className="font-mono">onClick</span>).
                </span>
              </li>
              <li>
                Converts inline <span className="font-mono">style</span> strings into JSX style
                objects with camelCase properties.
              </li>
              <li>
                <span className="inline-flex flex-wrap items-center gap-0.5">
                  Self-closes void elements like
                  <span className="font-mono">&lt;br&gt;</span>,
                  <span className="font-mono">&lt;img&gt;</span>,
                  <span className="font-mono">&lt;input&gt;</span>.
                </span>
              </li>
              <li>Wraps multiple root elements in a fragment when generating a component.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}

export default HtmlToJsxPage;
