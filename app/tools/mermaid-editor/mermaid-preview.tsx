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
  default: "#ffffff",
  dark: "#1f2020",
  forest: "#f9fafb",
  neutral: "#eee8d5",
  base: "#ffffff",
};

export function MermaidPreview({
  code,
  theme,
  look,
  fontFamily,
  handDrawnSeed,
  fontSize,
  backgroundColor,
  primaryColor,
  fontColor,
  curve,
  onErrorAction,
  onRenderAction,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then((mod) => {
      if (cancelled) return;
      mod.default.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        htmlLabels: false,
        flowchart: { htmlLabels: false },
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
          theme,
          look,
          fontFamily,
          handDrawnSeed,
          flowchart: { curve },
          gantt: { useWidth: (containerRef.current?.offsetWidth ?? 900) - 32 },
          themeVariables: {
            ...(isBase && {
              background: backgroundColor,
              primaryColor,
              primaryTextColor: fontColor,
              primaryBorderColor: "#4b5563",
              lineColor: "#6b7280",
            }),
            fontSize: `${fontSize}px`,
            fontFamily,
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
    code,
    theme,
    look,
    fontFamily,
    handDrawnSeed,
    initialized,
    onErrorAction,
    onRenderAction,
    fontSize,
    backgroundColor,
    primaryColor,
    fontColor,
    curve,
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
