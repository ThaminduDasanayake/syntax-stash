export type AnimationType = "to" | "from";
export type EasingType = "power1.out" | "power3.inOut" | "elastic.out(1, 0.3)" | "bounce.out";

export type PositionType = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface AnimConfig {
  type: AnimationType;
  ease: EasingType;
  duration: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  scale: number;
}

export function generateCode(cfg: AnimConfig): string {
  const props: Record<string, unknown> = {};
  if (cfg.x !== 0) props.x = cfg.x;
  if (cfg.y !== 0) props.y = cfg.y;
  if (cfg.rotation !== 0) props.rotation = cfg.rotation;
  if (cfg.opacity !== 1) props.opacity = cfg.opacity;
  if (cfg.scale !== 1) props.scale = cfg.scale;
  props.duration = cfg.duration;
  props.ease = `"${cfg.ease}"`;

  const propsStr = Object.entries(props)
    .map(([k, v]) => `      ${k}: ${v},`)
    .join("\n");

  // language=text
  return `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AnimatedComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.${cfg.type}(".box", {
${propsStr}
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <div
        className="box"
        style={{
          width: 80,
          height: 80,
          background: "oklch(0.6 0.2 260)",
          borderRadius: 8,
        }}
      />
    </div>
  );
}`;
}
