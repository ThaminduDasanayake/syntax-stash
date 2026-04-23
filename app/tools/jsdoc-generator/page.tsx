"use client";

import { BookText } from "lucide-react";
import { useMemo, useState } from "react";

import { generateDoc, parseFunctionSignature, type DocStyle } from "@/app/tools/jsdoc-generator/helpers";
import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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
      if (!result) return { output: "", error: "Could not parse function signature.", parsed: null };
      return { output: generateDoc(result, style, includeThrows), error: null, parsed: result };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Parse error", parsed: null };
    }
  }, [input, style, includeThrows]);

  const documented = useMemo(() => {
    if (!output || !input.trim()) return "";
    return `${output}\n${input.trim()}`;
  }, [output, input]);

  return (
    <ToolLayout
      icon={BookText}
      title="JSDoc / TSDoc"
      highlight="Generator"
      description="Paste a TypeScript function signature and generate JSDoc or TSDoc with @param, @returns, and @throws stubs."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Function signature</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="resize-y font-mono text-xs"
              placeholder="Paste a function declaration, arrow function, or method signature…"
              spellCheck={false}
            />
            {parsed && (
              <p className="text-muted-foreground text-xs">
                Parsed <span className="text-foreground font-mono">{parsed.name}</span>
                {parsed.params.length > 0 && ` — ${parsed.params.length} parameter${parsed.params.length === 1 ? "" : "s"}`}
                {parsed.isAsync && ", async"}
                {parsed.isArrow && ", arrow"}
                {parsed.isGenerator && ", generator"}
              </p>
            )}
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated comment</Label>
              <CopyButton value={documented} disabled={!documented} />
            </div>
            <Textarea
              readOnly
              value={documented}
              rows={12}
              className="resize-y font-mono text-xs"
              placeholder="Generated documentation will appear here…"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Tabs value={style} onValueChange={(v) => setStyle(v as DocStyle)}>
            <TabsList>
              <TabsTrigger value="jsdoc">JSDoc</TabsTrigger>
              <TabsTrigger value="tsdoc">TSDoc</TabsTrigger>
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
            <li><strong className="text-foreground">JSDoc</strong> — includes <code className="bg-card px-1 rounded">{"{type}"}</code> in tags. Common for plain JavaScript files where types live in comments.</li>
            <li><strong className="text-foreground">TSDoc</strong> — omits <code className="bg-card px-1 rounded">{"{type}"}</code>. Used in TypeScript projects where the compiler already knows the types.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
