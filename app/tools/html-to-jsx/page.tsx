"use client";

import { useMemo, useState } from "react";

import { convertHtmlToJsx, type ConvertOptions } from "@/app/tools/html-to-jsx/helpers";
import ToolLayout from "@/components/layout/layout.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import ClearButton from "@/components/ui/clear-button.tsx";
import CopyButton from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field.tsx";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextAreaField } from "@/components/ui/textarea-field.tsx";
import { developmentTools } from "@/lib/tools-data.ts";

const PLACEHOLDER = `<!-- A login form -->
<form class="login-form" onsubmit="handleSubmit(event)">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" autocomplete="email" required>

  <label for="password">Password</label>
  <input type="password" id="password" name="password" minlength="8" required>

  <div style="margin-top: 16px; display: flex; gap: 8px;">
    <button type="submit" class="primary">Sign in</button>
    <button type="button" tabindex="-1">Cancel</button>
  </div>

  <img src="/logo.png" alt="Logo" width="120">
</form>`;

export default function HtmlToJsxPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [componentName, setComponentName] = useState("MyComponent");
  const [asComponent, setAsComponent] = useState(true);
  const [selfCloseEmpty, setSelfCloseEmpty] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      const opts: ConvertOptions = { componentName, asComponent, selfCloseEmpty };
      return { output: convertHtmlToJsx(input, opts), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
    }
  }, [input, componentName, asComponent, selfCloseEmpty]);

  const tool = developmentTools.find((t) => t.url === "/tools/html-to-jsx");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextAreaField
            label="HTML input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
            className="resize-y text-xs"
            placeholder="Paste HTML here…"
            spellCheck={false}
            action={
              <ClearButton
                onClick={() => {
                  setInput("");
                }}
                disabled={!input}
              />
            }
          />
          {error && <p className="text-destructive text-xs">{error}</p>}

          <TextAreaField
            label="JSX output"
            readOnly
            value={output}
            rows={20}
            className="resize-y text-xs"
            placeholder="JSX will appear here…"
            action={<CopyButton value={output} disabled={!output} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Label>Output mode</Label>
            <div className="flex items-center gap-2">
              <Switch id="as-component" checked={asComponent} onCheckedChange={setAsComponent} />
              <Label htmlFor="as-component" className="cursor-pointer text-sm">
                Wrap in React component
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="self-close"
                checked={selfCloseEmpty}
                onCheckedChange={setSelfCloseEmpty}
              />
              <Label htmlFor="self-close" className="cursor-pointer text-sm">
                Self-close empty elements
              </Label>
            </div>
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

        <Card className="p-4 text-xs">
          <CardContent>
            <p className="text-foreground mb-2 font-semibold">What this does</p>
            <ul className="text-muted-foreground space-y-1">
              <li>
                • Renames reserved attributes: <code className="bg-card rounded px-1">class</code> →{" "}
                <code className="bg-card rounded px-1">className</code>,{" "}
                <code className="bg-card rounded px-1">for</code> →{" "}
                <code className="bg-card rounded px-1">htmlFor</code>,{" "}
                <code className="bg-card rounded px-1">tabindex</code> →{" "}
                <code className="bg-card rounded px-1">tabIndex</code>, etc.
              </li>
              <li>
                • Converts event handlers to camelCase (
                <code className="bg-card rounded px-1">onclick</code> →{" "}
                <code className="bg-card rounded px-1">onClick</code>)
              </li>
              <li>
                • Converts inline <code className="bg-card rounded px-1">style</code> strings into
                JSX style objects with camelCase properties.
              </li>
              <li>
                • Self-closes void elements like{" "}
                <code className="bg-card rounded px-1">{"<br>"}</code>,{" "}
                <code className="bg-card rounded px-1">{"<img>"}</code>,{" "}
                <code className="bg-card rounded px-1">{"<input>"}</code>.
              </li>
              <li>• Wraps multiple root elements in a fragment when generating a component.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
