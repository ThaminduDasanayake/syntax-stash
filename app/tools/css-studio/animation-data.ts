export type Keyframe = {
  percent: number;
  properties: { key: string; value: string }[];
};

export type Preset = {
  label: string;
  keyframes: Keyframe[];
  duration: number;
  timing: string;
  iterations: string;
};

export const TIMING_FUNCTIONS = ["ease", "ease-in", "ease-in-out", "ease-out", "linear"];

export const PRESETS: Preset[] = [
  {
    duration: 400,
    iterations: "1",
    keyframes: [
      {
        percent: 0,
        properties: [
          { key: "opacity", value: "0" },
          { key: "transform", value: "translateY(24px)" },
        ],
      },
      {
        percent: 100,
        properties: [
          { key: "opacity", value: "1" },
          { key: "transform", value: "translateY(0)" },
        ],
      },
    ],
    label: "Slide Up",
    timing: "ease-out",
  },
  {
    duration: 400,
    iterations: "1",
    keyframes: [
      { percent: 0, properties: [{ key: "opacity", value: "0" }] },
      { percent: 100, properties: [{ key: "opacity", value: "1" }] },
    ],
    label: "Fade In",
    timing: "ease-out",
  },
  {
    duration: 600,
    iterations: "1",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "translateX(0)" }] },
      { percent: 20, properties: [{ key: "transform", value: "translateX(-8px)" }] },
      { percent: 40, properties: [{ key: "transform", value: "translateX(8px)" }] },
      { percent: 60, properties: [{ key: "transform", value: "translateX(-8px)" }] },
      { percent: 80, properties: [{ key: "transform", value: "translateX(8px)" }] },
      { percent: 100, properties: [{ key: "transform", value: "translateX(0)" }] },
    ],
    label: "Shake",
    timing: "ease-in-out",
  },
  {
    duration: 800,
    iterations: "infinite",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "translateY(0)" }] },
      { percent: 25, properties: [{ key: "transform", value: "translateY(-12px)" }] },
      { percent: 50, properties: [{ key: "transform", value: "translateY(0)" }] },
      { percent: 75, properties: [{ key: "transform", value: "translateY(-6px)" }] },
      { percent: 100, properties: [{ key: "transform", value: "translateY(0)" }] },
    ],
    label: "Bounce",
    timing: "ease-in-out",
  },
  {
    duration: 1000,
    iterations: "infinite",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "rotate(0deg)" }] },
      { percent: 100, properties: [{ key: "transform", value: "rotate(360deg)" }] },
    ],
    label: "Spin",
    timing: "linear",
  },
  {
    duration: 2000,
    iterations: "infinite",
    keyframes: [
      { percent: 0, properties: [{ key: "opacity", value: "1" }] },
      { percent: 50, properties: [{ key: "opacity", value: "0.4" }] },
      { percent: 100, properties: [{ key: "opacity", value: "1" }] },
    ],
    label: "Pulse",
    timing: "ease-in-out",
  },
];

export const COMMON_PROPERTIES = [
  "background-color",
  "border-radius",
  "box-shadow",
  "color",
  "filter",
  "height",
  "opacity",
  "transform",
  "width",
];
