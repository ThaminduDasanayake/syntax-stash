import { ReactNode } from "react";

export const OG_COLORS = {
  orange: "#E8A52B",
  bgCard: "#F5F0E6",
  fgDark: "#18181b",
  muted: "#52525b",
  subtle: "#71717a",
} as const;

export interface OgTemplateProps {
  description?: string;
  eyebrow?: string;
  statsText?: string;
  title: ReactNode | string;
}

export function OgTemplate({ title, description, eyebrow, statsText }: OgTemplateProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        backgroundColor: OG_COLORS.bgCard,
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* Main Inner Content (Full Size, Generous Breathing Room) */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 80px 44px",
        }}
      >
        {/* Top Header: Brand Lockup in Dark */}
        <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#14110b",
              borderRadius: "10px",
              color: OG_COLORS.orange,
              display: "flex",
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontSize: "38px",
              fontWeight: 900,
              height: "48px",
              justifyContent: "center",
              lineHeight: 1,
              width: "48px",
            }}
          >
            S
          </div>
          <div
            style={{
              alignItems: "baseline",
              display: "flex",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                color: OG_COLORS.fgDark,
                display: "flex",
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: "40px",
                fontWeight: 900,
                letterSpacing: "-1.5px",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              SYNTAX
            </span>
            <span
              style={{
                color: OG_COLORS.orange,
                display: "flex",
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontSize: "40px",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              .
            </span>
            <span
              style={{
                color: OG_COLORS.fgDark,
                display: "flex",
                fontFamily: "Instrument Serif, serif",
                fontSize: "48px",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "0px",
                lineHeight: 1,
                textTransform: "lowercase",
              }}
            >
              stash
            </span>
          </div>
        </div>

        {/* Center Hero: Two-Tone Title + Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1040px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            {eyebrow && (
              <div
                style={{
                  color: OG_COLORS.fgDark,
                  display: "flex",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: "52px",
                  fontWeight: 900,
                  letterSpacing: "-1.5px",
                }}
              >
                {eyebrow}
              </div>
            )}
            {typeof title === "string" ? (
              <div
                style={{
                  color: OG_COLORS.orange,
                  display: "flex",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontSize: eyebrow ? "70px" : "64px",
                  fontWeight: 900,
                  letterSpacing: "-2px",
                }}
              >
                {title}
              </div>
            ) : (
              title
            )}
          </div>

          {description && (
            <div
              style={{
                color: OG_COLORS.muted,
                display: "flex",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "21px",
                fontWeight: 400,
                letterSpacing: "-0.3px",
                lineHeight: 1.5,
                maxWidth: "960px",
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom Row: Simple Stats */}
        {statsText ? (
          <div
            style={{
              alignItems: "center",
              color: OG_COLORS.subtle,
              display: "flex",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "18px",
              fontWeight: 400,
              letterSpacing: "-0.2px",
            }}
          >
            {statsText}
          </div>
        ) : (
          <div style={{ display: "flex", height: "1px" }} />
        )}
      </div>

      {/* Full-Bleed Solid Orange Bottom Bar */}
      <div
        style={{
          backgroundColor: OG_COLORS.orange,
          display: "flex",
          height: "16px",
          width: "100%",
        }}
      />
    </div>
  );
}
