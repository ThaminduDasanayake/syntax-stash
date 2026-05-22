"use client";

import { useMemo, useState } from "react";

import {
  type DocStyle,
  generateDoc,
  parseFunctionSignature,
} from "@/app/tools/jsdoc-generator/helpers";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { SwitchField } from "@/components/ui/switch-field";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

// language=text
const PLACEHOLDER = `async function fetchUser<T extends { id: string }>(id: string, options?: { signal?: AbortSignal }): Promise<T> {
  // ...
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

  const tool = internalTools.find((t) => t.slug === "jsdoc-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 flex-1 flex-col space-y-6">
        <div className="flex min-h-0 flex-1 flex-col space-y-2">
          <TextareaGroup
            containerClassName="flex-1 min-h-[300px]"
            label="Function signature"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a function declaration, arrow function, or method signature..."
            action={<ClearButton size="sm" onClick={() => setInput("")} />}
          />
          <div className="flex shrink-0 items-center justify-between gap-4">
            {parsed && (
              <p className="text-muted-foreground shrink-0 text-xs">
                Parsed <span className="text-foreground font-mono">{parsed.name}</span>
                {parsed.params.length > 0 &&
                  ` — ${parsed.params.length} parameter${parsed.params.length === 1 ? "" : "s"}`}
                {parsed.isAsync && ", async"}
                {parsed.isArrow && ", arrow"}
                {parsed.isGenerator && ", generator"}
              </p>
            )}
          </div>
          {error && <ErrorAlert message={error} />}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-6 py-1">
          <div className="flex flex-col space-y-2">
            <ButtonGroup aria-label="Documentation style selection">
              <Button
                variant={style === "jsdoc" ? "default" : "outline"}
                onClick={() => setStyle("jsdoc")}
                className="w-20 font-semibold"
              >
                JSDoc
              </Button>
              <Button
                variant={style === "tsdoc" ? "default" : "outline"}
                onClick={() => setStyle("tsdoc")}
                className="w-20 font-semibold"
              >
                TSDoc
              </Button>
            </ButtonGroup>
          </div>

          <SwitchField
            label="Include @throws"
            checked={includeThrows}
            onCheckedChange={setIncludeThrows}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <TextareaGroup
            label="Generated comment"
            readOnly
            value={documented}
            containerClassName="flex-1 min-h-[300px]"
            placeholder="Generated documentation will appear here..."
            action={<CopyButton iconOnly textToCopy={documented} disabled={!documented} />}
          />
        </div>

        <div className="border-border bg-muted/30 shrink-0 rounded-xl border p-4 text-xs">
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
