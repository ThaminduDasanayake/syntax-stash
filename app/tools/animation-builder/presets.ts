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

export const TIMING_FUNCTIONS = ["ease", "ease-in", "ease-out", "ease-in-out", "linear"];

export const PRESETS: Preset[] = [
  {
    label: "Fade In",
    keyframes: [
      { percent: 0, properties: [{ key: "opacity", value: "0" }] },
      { percent: 100, properties: [{ key: "opacity", value: "1" }] },
    ],
    duration: 400,
    timing: "ease-out",
    iterations: "1",
  },
  {
    label: "Slide Up",
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
    duration: 400,
    timing: "ease-out",
    iterations: "1",
  },
  {
    label: "Bounce",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "translateY(0)" }] },
      { percent: 25, properties: [{ key: "transform", value: "translateY(-12px)" }] },
      { percent: 50, properties: [{ key: "transform", value: "translateY(0)" }] },
      { percent: 75, properties: [{ key: "transform", value: "translateY(-6px)" }] },
      { percent: 100, properties: [{ key: "transform", value: "translateY(0)" }] },
    ],
    duration: 800,
    timing: "ease-in-out",
    iterations: "infinite",
  },
  {
    label: "Pulse",
    keyframes: [
      { percent: 0, properties: [{ key: "opacity", value: "1" }] },
      { percent: 50, properties: [{ key: "opacity", value: "0.4" }] },
      { percent: 100, properties: [{ key: "opacity", value: "1" }] },
    ],
    duration: 2000,
    timing: "ease-in-out",
    iterations: "infinite",
  },
  {
    label: "Spin",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "rotate(0deg)" }] },
      { percent: 100, properties: [{ key: "transform", value: "rotate(360deg)" }] },
    ],
    duration: 1000,
    timing: "linear",
    iterations: "infinite",
  },
  {
    label: "Shake",
    keyframes: [
      { percent: 0, properties: [{ key: "transform", value: "translateX(0)" }] },
      { percent: 20, properties: [{ key: "transform", value: "translateX(-8px)" }] },
      { percent: 40, properties: [{ key: "transform", value: "translateX(8px)" }] },
      { percent: 60, properties: [{ key: "transform", value: "translateX(-8px)" }] },
      { percent: 80, properties: [{ key: "transform", value: "translateX(8px)" }] },
      { percent: 100, properties: [{ key: "transform", value: "translateX(0)" }] },
    ],
    duration: 600,
    timing: "ease-in-out",
    iterations: "1",
  },
];
