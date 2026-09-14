import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";
import { internalTools } from "@/lib/tools-data";

export const runtime = "edge";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  const toolCount = internalTools.length;

  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        backgroundColor: "#14110b",
        color: "#f5f1e5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "70px 80px",
        width: "100%",
      }}
    >
      {/* Top Header: Logo + Utilities Badge */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "14px" }}>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#f5f1e5",
              borderRadius: "8px",
              color: "#14110b",
              display: "flex",
              fontSize: "28px",
              fontWeight: 900,
              height: "44px",
              justifyContent: "center",
              width: "44px",
            }}
          >
            S
          </div>
          <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "2px", opacity: 0.85 }}>
            SYNTAX-STASH
          </span>
        </div>

        <div
          style={{
            alignItems: "center",
            backgroundColor: "rgba(232, 165, 43, 0.15)",
            border: "1.5px solid rgba(232, 165, 43, 0.4)",
            borderRadius: "6px",
            color: "#e8a52b",
            display: "flex",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "1.5px",
            padding: "6px 16px",
            textTransform: "uppercase",
          }}
        >
          Developer Tools
        </div>
      </div>

      {/* Main Title & Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            maxWidth: "950px",
          }}
        >
          Browser-Native Developer Tools & Studios
        </div>
        <div
          style={{
            color: "#9a927f",
            fontSize: "22px",
            lineHeight: 1.4,
            maxWidth: "850px",
          }}
        >
          Formatters, Converters, CSS Studios, Regex Testers, Diff Viewers, and Code Generators — 100% private, client-side execution.
        </div>
      </div>

      {/* Footer: Metrics Pill & Canonical Link */}
      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid #272218",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "rgba(245, 241, 229, 0.08)",
            borderRadius: "6px",
            color: "#f5f1e5",
            display: "flex",
            fontSize: "18px",
            fontWeight: 700,
            gap: "8px",
            padding: "8px 18px",
          }}
        >
          <span style={{ color: "#e8a52b" }}>●</span>
          <span>{toolCount}+ Free Developer Utilities</span>
        </div>

        <div style={{ color: "#e8a52b", fontSize: "18px", fontWeight: 600 }}>
          {siteConfig.url}/tools
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
