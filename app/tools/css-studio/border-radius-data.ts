type Corner = { h: number; v: number };
export type Corners = { tl: Corner; tr: Corner; br: Corner; bl: Corner };
export type Mode = "Simple" | "Advanced";

export const PRESETS: { label: string; corners: Corners }[] = [
  {
    corners: { bl: { h: 0, v: 0 }, br: { h: 0, v: 0 }, tl: { h: 0, v: 0 }, tr: { h: 0, v: 0 } },
    label: "None",
  },
  {
    corners: { bl: { h: 8, v: 8 }, br: { h: 8, v: 8 }, tl: { h: 8, v: 8 }, tr: { h: 8, v: 8 } },
    label: "Rounded",
  },
  {
    corners: {
      bl: { h: 24, v: 24 },
      br: { h: 24, v: 24 },
      tl: { h: 24, v: 24 },
      tr: { h: 24, v: 24 },
    },
    label: "Large",
  },
  {
    corners: {
      bl: { h: 30, v: 30 },
      br: { h: 30, v: 30 },
      tl: { h: 30, v: 30 },
      tr: { h: 30, v: 30 },
    },
    label: "Squircle",
  },
  {
    corners: {
      bl: { h: 30, v: 70 },
      br: { h: 70, v: 70 },
      tl: { h: 30, v: 30 },
      tr: { h: 70, v: 30 },
    },
    label: "Blob",
  },
  {
    corners: { bl: { h: 48, v: 48 }, br: { h: 0, v: 0 }, tl: { h: 0, v: 0 }, tr: { h: 48, v: 48 } },
    label: "Notched",
  },
  {
    corners: {
      bl: { h: 50, v: 50 },
      br: { h: 50, v: 50 },
      tl: { h: 50, v: 50 },
      tr: { h: 50, v: 50 },
    },
    label: "Circle",
  },
  {
    corners: {
      bl: { h: 9999, v: 9999 },
      br: { h: 9999, v: 9999 },
      tl: { h: 9999, v: 9999 },
      tr: { h: 9999, v: 9999 },
    },
    label: "Pill",
  },
];
