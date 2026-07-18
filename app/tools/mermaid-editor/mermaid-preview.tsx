"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  theme: string;
  look: string;
  fontFamily: string;
  handDrawnSeed: number;
  fontSize: number;
  backgroundColor: string;
  primaryColor: string;
  fontColor: string;
  curve: string;
  onErrorAction: (err: string | null) => void;
  onRenderAction: (svg: string) => void;
};

let idCounter = 0;

const THEME_BACKGROUNDS: Record<string, string> = {
  base: "#ffffff",
  dark: "#1f2020",
  default: "#ffffff",
  forest: "#f9fafb",
  neutral: "#eee8d5",
};

export function MermaidPreview({
  backgroundColor,
  code,
  curve,
  fontColor,
  fontFamily,
  fontSize,
  handDrawnSeed,
  look,
  onErrorAction,
  onRenderAction,
  primaryColor,
  theme,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then((mod) => {
      if (cancelled) return;
      mod.default.initialize({
        flowchart: { htmlLabels: false },
        htmlLabels: false,
        securityLevel: "loose",
        startOnLoad: false,
      });
      setInitialized(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!initialized || !code.trim()) return;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("mermaid");

        const isBase = theme === "base";
        const initConfig = {
          flowchart: { curve },
          fontFamily,
          gantt: { useWidth: (containerRef.current?.offsetWidth ?? 900) - 32 },
          handDrawnSeed,
          look,
          theme,
          themeVariables: {
            ...(isBase && {
              background: backgroundColor,
              lineColor: "#6b7280",
              primaryBorderColor: "#4b5563",
              primaryColor,
              primaryTextColor: fontColor,
            }),
            fontFamily,
            fontSize: `${fontSize}px`,
          },
        };

        const config = `%%{init: ${JSON.stringify(initConfig)} }%%\n`;
        const codeWithConfig = config + code;

        await mod.default.parse(codeWithConfig);

        const id = `mermaid-${++idCounter}`;
        const { svg: rendered } = await mod.default.render(id, codeWithConfig);
        if (cancelled) return;
        setSvg(rendered);
        onRenderAction(rendered);
        onErrorAction(null);
      } catch (e) {
        if (cancelled) return;
        onErrorAction(e instanceof Error ? e.message : "Render error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    backgroundColor,
    code,
    curve,
    fontColor,
    fontFamily,
    fontSize,
    handDrawnSeed,
    initialized,
    look,
    onErrorAction,
    onRenderAction,
    primaryColor,
    theme,
  ]);

  if (!svg) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        {initialized ? "Waiting for input..." : "Loading Mermaid..."}
      </div>
    );
  }

  const previewBg = theme === "base" ? backgroundColor : (THEME_BACKGROUNDS[theme] ?? "#ffffff");

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center overflow-auto p-4"
      style={{ backgroundColor: previewBg }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
