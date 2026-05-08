"use client";

import { useMemo, useState } from "react";

import {
  type DocStyle,
  generateDoc,
  parseFunctionSignature,
} from "@/app/tools/jsdoc-generator/helpers";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/layout";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAreaField } from "@/components/ui/textarea-field";
import { internalTools } from "@/lib/tools-data";

// language=text
const PLACEHOLDER = `async function fetchUser<T extends { id: string }>(id: string, options?: { signal?: AbortSignal }): Promise<T> {
  // …
}`;

export default function JsdocGeneratorPage() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [style, setStyle] = useState<DocStyle>("jsdoc");
  const [includeThrows, setIncludeThrows] = useState(false);

  const { output, error, parsed } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null, parsed: null };
    try {
      const result = parseFunctionSignature(input);
      if (!result)
        return { output: "", error: "Could not parse function signature.", parsed: null };
      return { output: generateDoc(result, style, includeThrows), error: null, parsed: result };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Parse error", parsed: null };
    }
  }, [input, style, includeThrows]);

  const documented = useMemo(() => {
    if (!output || !input.trim()) return "";
    return `${output}\n${input.trim()}`;
  }, [output, input]);

  const tool = internalTools.find((t) => t.url === "/tools/jsdoc-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <TextAreaField
              label="Function signature"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="resize-y font-mono text-xs"
              placeholder="Paste a function declaration, arrow function, or method signature…"
              spellCheck={false}
              action={<ClearButton onClick={() => setInput("")} />}
            />
            {parsed && (
              <p className="text-muted-foreground text-xs">
                Parsed <span className="text-foreground font-mono">{parsed.name}</span>
                {parsed.params.length > 0 &&
                  ` — ${parsed.params.length} parameter${parsed.params.length === 1 ? "" : "s"}`}
                {parsed.isAsync && ", async"}
                {parsed.isArrow && ", arrow"}
                {parsed.isGenerator && ", generator"}
              </p>
            )}
            {error && <ErrorAlert message={error} />}
          </div>

          <TextAreaField
            label="Generated comment"
            readOnly
            value={documented}
            rows={12}
            className="resize-y font-mono text-xs"
            placeholder="Generated documentation will appear here…"
            action={<CopyButton value={documented} disabled={!documented} />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Tabs value={style} onValueChange={(v) => setStyle(v as DocStyle)}>
            <TabsList className="grid w-40 grid-cols-2">
              <TabsTrigger value="jsdoc" className="tab-trigger">
                JSDoc
              </TabsTrigger>
              <TabsTrigger value="tsdoc" className="tab-trigger">
                TSDoc
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Switch id="throws" checked={includeThrows} onCheckedChange={setIncludeThrows} />
            <Label htmlFor="throws" className="cursor-pointer text-sm">
              Include @throws
            </Label>
          </div>
        </div>

        <div className="border-border bg-muted/30 rounded-xl border p-4 text-xs">
          <p className="text-foreground mb-2 font-semibold">Style differences</p>
          <ul className="text-muted-foreground space-y-1">
            <li>
              <strong className="text-foreground">JSDoc</strong> — includes{" "}
              <code className="bg-card rounded px-1">{"{type}"}</code> in tags. Common for plain
              JavaScript files where types live in comments.
            </li>
            <li>
              <strong className="text-foreground">TSDoc</strong> — omits{" "}
              <code className="bg-card rounded px-1">{"{type}"}</code>. Used in TypeScript projects
              where the compiler already knows the types.
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
