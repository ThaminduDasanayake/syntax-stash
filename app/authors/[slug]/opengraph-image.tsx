import { ImageResponse } from "next/og";

import { getAuthorBySlug } from "@/lib/authors";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const authorData = await getAuthorBySlug(slug);

  const authorName = authorData?.name || "Author Profile";
  const resourceCount = authorData?.count || 0;

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
      {/* Top Header: Logo + Creator Spotlight Badge */}
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
          Creator Spotlight
        </div>
      </div>

      {/* Main Author Name & Subtitle */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: "60px",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            maxWidth: "950px",
          }}
        >
          {authorName}
        </div>
        <div
          style={{
            color: "#9a927f",
            fontSize: "24px",
            lineHeight: 1.4,
            maxWidth: "850px",
          }}
        >
          Curated developer tools, open-source libraries, and utilities created or maintained by {authorName}.
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
          <span>{resourceCount} Curated {resourceCount === 1 ? "Tool" : "Tools"}</span>
        </div>

        <div style={{ color: "#e8a52b", fontSize: "18px", fontWeight: 600 }}>
          {siteConfig.url}/authors/{slug}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
