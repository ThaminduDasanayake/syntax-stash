import { PositionType } from "@/app/tools/css-studio/gsap-helpers";

export const positionOptions = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

export const positionClasses: Record<PositionType, string> = {
  center: "inset-0 m-auto",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

export const typeOptions = [
  { value: "to", label: "gsap.to() — Animate to these values" },
  { value: "from", label: "gsap.from() — Animate from these values" },
  { value: "set", label: "gsap.set() — Apply instantly (0s duration)" },
  // { value: "fromTo", label: "gsap.fromTo() — (Requires start & end inputs)" },
];

export const easingOptions = [
  // Linear
  { value: "none", label: "none (linear) — Constant speed" },

  // Power Eases (Gradual curves)
  { value: "power1.out", label: "power1.out — Very subtle deceleration" },
  { value: "power2.out", label: "power2.out — Standard deceleration" },
  { value: "power3.out", label: "power3.out — Strong deceleration" },
  { value: "power4.out", label: "power4.out — Very strong deceleration" },
  { value: "power1.inOut", label: "power1.inOut — Subtle ease in & out" },
  { value: "power3.inOut", label: "power3.inOut — Smooth, cinematic ease" },
  { value: "power4.inOut", label: "power4.inOut — Snappy mid-point ease" },

  // Back (Overshoots the target and pulls back)
  { value: "back.out(1.7)", label: "back.out — Overshoots and settles" },
  { value: "back.in(1.7)", label: "back.in — Anticipates then shoots out" },
  { value: "back.inOut(1.7)", label: "back.inOut — Anticipates and overshoots" },

  // Elastic (Wobbly/Springy)
  { value: "elastic.out(1, 0.3)", label: "elastic.out — Standard spring" },
  { value: "elastic.out(1, 0.5)", label: "elastic.out(1, 0.5) — Loose spring" },
  { value: "elastic.out(1, 0.15)", label: "elastic.out(1, 0.15) — Tight spring" },

  // Bounce
  { value: "bounce.out", label: "bounce.out — Bounces to a stop" },
  { value: "bounce.in", label: "bounce.in — Bounces at the start" },

  // Specialty Mathematical Eases
  { value: "circ.out", label: "circ.out — Circular curve" },
  { value: "expo.out", label: "expo.out — Exponential curve" },
  { value: "sine.inOut", label: "sine.inOut — Gentle sine wave" },

  // Stepped (Blocky/Frame-by-frame)
  { value: "steps(5)", label: "steps(5) — Choppy, 5-frame animation" },
  { value: "steps(12)", label: "steps(12) — Choppy, 12-frame animation" },
];
