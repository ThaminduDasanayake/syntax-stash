"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  onError: (err: string | null) => void;
  onRender: (svg: string) => void;
};

let idCounter = 0;

export function MermaidPreview({ code, onError, onRender }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  // Initialize mermaid once on the client
  useEffect(() => {
    let cancelled = false;
    import("mermaid").then((mod) => {
      if (cancelled) return;
      mod.default.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose" });
      setInitialized(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!initialized || !code.trim()) return;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("mermaid");
        // Validate syntax first (throws on error)
        await mod.default.parse(code);

        const id = `mermaid-${++idCounter}`;
        const { svg: rendered } = await mod.default.render(id, code);
        if (cancelled) return;
        setSvg(rendered);
        onRender(rendered);
        onError(null);
      } catch (e) {
        if (cancelled) return;
        onError(e instanceof Error ? e.message : "Render error");
      }
    })();

    return () => { cancelled = true; };
  }, [code, initialized, onError, onRender]);

  if (!svg) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        {initialized ? "Waiting for input…" : "Loading Mermaid…"}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center overflow-auto p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
