"use client";

import { useMemo, useState } from "react";

import { EncoderAction } from "@/app/tools/encoder-decoder/types";
import {
  decodeBase64,
  encodeBase64,
  hexToString,
  stringToHex,
} from "@/app/tools/encoder-decoder/utils";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

const ACTIONS: EncoderAction[] = [
  { id: "b64-enc", label: "Encode Base64", run: encodeBase64 },
  { id: "b64-dec", label: "Decode Base64", run: decodeBase64 },
  { id: "url-enc", label: "URL Encode", run: encodeURIComponent },
  { id: "url-dec", label: "URL Decode", run: decodeURIComponent },
  { id: "hex-enc", label: "String to Hex", run: stringToHex },
  { id: "hex-dec", label: "Hex to String", run: hexToString },
];

export default function EncoderPage() {
  const [input, setInput] = useState("Hello, syntax-stash!");
  const [actionId, setActionId] = useState<string | null>(null);

  function handleRun(action: EncoderAction) {
    if (actionId === action.id) {
      setActionId(null);
    } else {
      setActionId(action.id);
    }
  }

  const { output, error } = useMemo(() => {
    if (!actionId) return { output: "", error: null };

    const activeAction = ACTIONS.find((a) => a.id === actionId);
    if (!activeAction) return { output: "", error: null };

    try {
      return { output: activeAction.run(input), error: null };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : `Failed to run ${activeAction.label}`,
      };
    }
  }, [input, actionId]);

  const tool = internalTools.find((t) => t.slug === "encoder-decoder");

  return (
    <ToolLayout tool={tool}>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-4">
        {/* Input */}
        <div className="flex min-h-0 flex-1 flex-col">
          <TextareaGroup
            variant="fill"
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text or encoded string here..."
            action={<ClearButton size="sm" onClick={() => setInput("")} disabled={!input} />}
          />
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap gap-2">
          {ACTIONS.map((a) => (
            <Button
              key={a.id}
              onClick={() => handleRun(a)}
              variant={actionId === a.id ? "default" : "outline"}
              className="text-xs font-semibold"
            >
              {a.label}
            </Button>
          ))}
        </div>

        {/* Error */}
        {error && <ErrorAlert message={error} />}

        {/* Output */}
        <div className="flex min-h-0 flex-1 flex-col">
          <TextareaGroup
            variant="fill"
            label="Output"
            readOnly
            value={output}
            placeholder="Run an action to see the result..."
            action={<CopyButton iconOnly textToCopy={output} disabled={!output} />}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
