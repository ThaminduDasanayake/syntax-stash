"use client";

import { ShieldHalf } from "lucide-react";
import { useMemo, useState } from "react";

import { EncoderAction } from "@/app/tools/encoder-decoder/types";
import {
  decodeBase64,
  encodeBase64,
  hexToString,
  stringToHex,
} from "@/app/tools/encoder-decoder/utils";
import { ErrorAlert } from "@/components/error-alert";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button";
import CopyButton from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

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

  return (
    <ToolLayout
      icon={ShieldHalf}
      title={
        <>
          Encoder <span className="text-primary">/</span> Decoder
        </>
      }
      description="Convert strings between Base64, URL-encoded, and Hex encodings."
    >
      <div className="space-y-6">
        {/* Input */}
        <TextAreaField
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text or encoded string here..."
          rows={8}
          action={
            <ClearButton
              onClick={() => {
                setInput("");
              }}
              disabled={!input}
            />
          }
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((a) => (
            <Button
              key={a.id}
              onClick={() => handleRun(a)}
              variant={actionId === a.id ? "default" : "outline"}
              className="px-4 text-xs font-semibold"
            >
              {a.label}
            </Button>
          ))}
        </div>

        {/* Error */}
        {error && <ErrorAlert message={error} />}

        {/* Output */}
        <TextAreaField
          label="Output"
          readOnly
          value={output}
          placeholder="Run an action to see the result..."
          rows={8}
          action={<CopyButton value={output} disabled={!output} />}
        />
      </div>
    </ToolLayout>
  );
}
