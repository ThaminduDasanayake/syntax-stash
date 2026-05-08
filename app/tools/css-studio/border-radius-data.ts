type Corner = { h: number; v: number };
export type Corners = { tl: Corner; tr: Corner; br: Corner; bl: Corner };
export type Mode = "Simple" | "Advanced";

export const PRESETS: { label: string; corners: Corners }[] = [
  {
    label: "None",
    corners: { tl: { h: 0, v: 0 }, tr: { h: 0, v: 0 }, br: { h: 0, v: 0 }, bl: { h: 0, v: 0 } },
  },
  {
    label: "Rounded",
    corners: { tl: { h: 8, v: 8 }, tr: { h: 8, v: 8 }, br: { h: 8, v: 8 }, bl: { h: 8, v: 8 } },
  },
  {
    label: "Large",
    corners: {
      tl: { h: 24, v: 24 },
      tr: { h: 24, v: 24 },
      br: { h: 24, v: 24 },
      bl: { h: 24, v: 24 },
    },
  },
  {
    label: "Pill",
    corners: {
      tl: { h: 9999, v: 9999 },
      tr: { h: 9999, v: 9999 },
      br: { h: 9999, v: 9999 },
      bl: { h: 9999, v: 9999 },
    },
  },
  {
    label: "Circle",
    corners: {
      tl: { h: 50, v: 50 },
      tr: { h: 50, v: 50 },
      br: { h: 50, v: 50 },
      bl: { h: 50, v: 50 },
    },
  },
  {
    label: "Squircle",
    corners: {
      tl: { h: 30, v: 30 },
      tr: { h: 30, v: 30 },
      br: { h: 30, v: 30 },
      bl: { h: 30, v: 30 },
    },
  },
  {
    label: "Blob",
    corners: {
      tl: { h: 30, v: 30 },
      tr: { h: 70, v: 30 },
      br: { h: 70, v: 70 },
      bl: { h: 30, v: 70 },
    },
  },
  {
    label: "Notched",
    corners: { tl: { h: 0, v: 0 }, tr: { h: 48, v: 48 }, br: { h: 0, v: 0 }, bl: { h: 48, v: 48 } },
  },
];
