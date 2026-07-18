import { PositionType } from "@/app/tools/css-studio/gsap-helpers";

export const positionOptions = [
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Center", value: "center" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
];

export const positionClasses: Record<PositionType, string> = {
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  center: "inset-0 m-auto",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
};

export const typeOptions = [
  { label: "gsap.from() — Animate from these values", value: "from" },
  { label: "gsap.set() — Apply instantly (0s duration)", value: "set" },
  { label: "gsap.to() — Animate to these values", value: "to" },
  // { value: "fromTo", label: "gsap.fromTo() — (Requires start & end inputs)" },
];

export const easingOptions = [
  { label: "back.in — Anticipates then shoots out", value: "back.in(1.7)" },

  { label: "back.inOut — Anticipates and overshoots", value: "back.inOut(1.7)" },
  // Back (Overshoots the target and pulls back)
  { label: "back.out — Overshoots and settles", value: "back.out(1.7)" },
  { label: "bounce.in — Bounces at the start", value: "bounce.in" },
  // Bounce
  { label: "bounce.out — Bounces to a stop", value: "bounce.out" },
  // Specialty Mathematical Eases
  { label: "circ.out — Circular curve", value: "circ.out" },
  // Elastic (Wobbly/Springy)
  { label: "elastic.out — Standard spring", value: "elastic.out(1, 0.3)" },
  { label: "elastic.out(1, 0.5) — Loose spring", value: "elastic.out(1, 0.5)" },

  { label: "elastic.out(1, 0.15) — Tight spring", value: "elastic.out(1, 0.15)" },
  { label: "expo.out — Exponential curve", value: "expo.out" },
  // Linear
  { label: "none (linear) — Constant speed", value: "none" },

  { label: "power1.inOut — Subtle ease in & out", value: "power1.inOut" },
  // Power Eases (Gradual curves)
  { label: "power1.out — Very subtle deceleration", value: "power1.out" },
  { label: "power2.out — Standard deceleration", value: "power2.out" },

  { label: "power3.inOut — Smooth, cinematic ease", value: "power3.inOut" },
  { label: "power3.out — Strong deceleration", value: "power3.out" },

  { label: "power4.inOut — Snappy mid-point ease", value: "power4.inOut" },
  { label: "power4.out — Very strong deceleration", value: "power4.out" },
  { label: "sine.inOut — Gentle sine wave", value: "sine.inOut" },

  // Stepped (Blocky/Frame-by-frame)
  { label: "steps(5) — Choppy, 5-frame animation", value: "steps(5)" },
  { label: "steps(12) — Choppy, 12-frame animation", value: "steps(12)" },
];
