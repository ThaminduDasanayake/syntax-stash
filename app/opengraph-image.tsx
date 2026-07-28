import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

export const alt = siteConfig.title;
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
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
          padding: "80px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#f5f1e5",
              borderRadius: "8px",
              color: "#14110b",
              display: "flex",
              fontSize: "32px",
              fontWeight: 900,
              height: "48px",
              justifyContent: "center",
              width: "48px",
            }}
          >
            S
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "2px", opacity: 0.8 }}>
            SYNTAX-STASH
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            Curated Developer Tools & Web Resources
          </div>
          <div
            style={{
              color: "#9a927f",
              fontSize: "24px",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            color: "#e8a52b",
            display: "flex",
            fontSize: "20px",
            gap: "16px",
          }}
        >
          <span>https://syntax-stash.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
