import { ReactNode } from "react";

export interface OgStatItem {
  color?: string;
  label: string;
  subtext: string;
  value: number | string;
}

export interface OgTemplateProps {
  badgeText: string;
  description: string;
  stat1: OgStatItem;
  stat2: OgStatItem;
  stat3: OgStatItem;
  title: ReactNode | string;
}

function StatCard({ stat }: { stat: OgStatItem }) {
  const accentColor = stat.color || "#e8a52b";
  return (
    <div
      style={{
        backgroundColor: "rgba(24, 24, 27, 0.8)",
        border: `1.5px solid ${accentColor}4d`,
        borderRadius: "16px",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: "4px",
        padding: "24px 28px",
      }}
    >
      <div
        style={{
          color: accentColor,
          display: "flex",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "76px",
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {`${stat.value}`}
      </div>
      <div
        style={{
          color: "#ffffff",
          display: "flex",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "2px",
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          color: "#71717a",
          display: "flex",
          fontSize: "13px",
          fontWeight: 500,
        }}
      >
        {stat.subtext}
      </div>
    </div>
  );
}

export function OgTemplate({
  title,
  badgeText,
  description,
  stat1,
  stat2,
  stat3,
}: OgTemplateProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 10% 10%, rgba(232, 165, 43, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.15) 0%, transparent 40%), radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        color: "#f4f4f5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "52px 64px",
        width: "100%",
      }}
    >
      {/* Top Header: Authentic Brand Icon + SYNTAX.stash Wordmark + Domain Badge */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
          {/* Logo Square */}
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#14110b",
              borderRadius: "12px",
              color: "#e8a52b",
              display: "flex",
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontSize: "44px",
              fontWeight: 800,
              height: "56px",
              justifyContent: "center",
              width: "56px",
            }}
          >
            S
          </div>

          {/* Authentic Wordmark: SYNTAX.stash */}
          <div style={{ alignItems: "baseline", display: "flex", fontSize: "36px" }}>
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 800,
                letterSpacing: "-1px",
              }}
            >
              SYNTAX
            </span>
            <span
              style={{
                color: "#e8a52b",
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 800,
              }}
            >
              .
            </span>
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              stash
            </span>
          </div>
        </div>

        {/* Right Badge */}
        <div
          style={{
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "#d4d4d8",
            display: "flex",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
            fontWeight: 800,
            padding: "8px 16px",
          }}
        >
          {badgeText}
        </div>
      </div>

      {/* Main Title & Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {typeof title === "string" ? (
          <div
            style={{
              color: "#ffffff",
              display: "flex",
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontSize: "54px",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.08,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        ) : (
          title
        )}
        <div
          style={{
            color: "#a1a1aa",
            display: "flex",
            fontSize: "20px",
            lineHeight: 1.45,
            maxWidth: "920px",
          }}
        >
          {description}
        </div>
      </div>

      {/* Massive Prominent Stats Grid (3 Columns) */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
        }}
      >
        <StatCard stat={stat1} />
        <StatCard stat={stat2} />
        <StatCard stat={stat3} />
      </div>
    </div>
  );
}
