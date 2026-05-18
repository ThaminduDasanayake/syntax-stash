"use client";

import { useEffect, useState } from "react";

import { FIGLET_FONTS, SAMPLE_BANNER } from "@/app/tools/ascii-studio/constants";
import { FigletFont } from "@/app/tools/ascii-studio/types";
import { ErrorAlert } from "@/components/error-alert";
import { CopyButton } from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextAreaField } from "@/components/ui/textarea-field";

// Module-scope cache — fonts are fetched once per session
const loadedFonts = new Set<FigletFont>();

export function TextBannerTab() {
  const [text, setText] = useState(SAMPLE_BANNER);
  const [font, setFont] = useState<FigletFont>("Standard");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const figlet = (await import("figlet")).default;

        if (!loadedFonts.has(font)) {
          const res = await fetch(`/figlet-fonts/${font}.flf`);
          if (!res.ok) throw new Error(`Failed to load font "${font}"`);
          figlet.parseFont(font, await res.text());
          loadedFonts.add(font);
        }

        const result = figlet.textSync(text, { font });
        if (isMounted) {
          setOutput(result);
          setError(null);
        }
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : "Banner generation failed");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [text, font]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          maxLength={20}
        />
        <SelectField
          label="Font"
          value={font}
          onValueChange={(v) => setFont(v as FigletFont)}
          options={FIGLET_FONTS}
        />
      </div>

      {error && <ErrorAlert message={error} />}

      <TextAreaField
        label="Output"
        readOnly
        value={output}
        rows={10}
        className="bg-muted/30! resize-none font-mono text-xs leading-tight"
        placeholder={text ? "Generating..." : "Enter text above to generate a banner."}
        action={<CopyButton textToCopy={output} disabled={!output} />}
      />
    </div>
  );
}
