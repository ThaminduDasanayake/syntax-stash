export type Colors = {
  name: string;
  hex: string;
  colSpan?: "col-span-1" | "col-span-2" | "col-span-3";
  textColor?: "white" | "black";
};

type Palette = {
  name: string;
  colors: Colors[];
};

export const COLOR_PALETTES: Palette[] = [
  {
    name: "Luxury Color 1",
    colors: [
      { name: "Cotton", hex: "#EDEBDE", colSpan: "col-span-3", textColor: "black" },
      { name: "Cherry Red", hex: "#810100", colSpan: "col-span-1", textColor: "white" },
      { name: "Maroon", hex: "#630102", colSpan: "col-span-2", textColor: "white" },
      { name: "Noir Black", hex: "#1B1716", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Luxury Color 2",
    colors: [
      { name: "Deep Bluish", hex: "#0D3A35", colSpan: "col-span-3", textColor: "white" },
      { name: "Moderate Green", hex: "#276152", colSpan: "col-span-1", textColor: "white" },
      { name: "Laurel Green", hex: "#B1B7AB", colSpan: "col-span-2", textColor: "black" },
      { name: "Light Cream", hex: "#FBF6F0", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Luxury Color 3",
    colors: [
      { name: "Deep Blue", hex: "#182350", colSpan: "col-span-3", textColor: "white" },
      { name: "Powder Blue", hex: "#AFD2FA", colSpan: "col-span-1", textColor: "black" },
      { name: "Floral White", hex: "#FEFAEF", colSpan: "col-span-2", textColor: "black" },
      { name: "Pale Brown", hex: "#B9915E", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Luxury Color 4",
    colors: [
      { name: "Black Bean", hex: "#3D1202", colSpan: "col-span-3", textColor: "white" },
      { name: "Mahogany", hex: "#BA3D03", colSpan: "col-span-1", textColor: "white" },
      { name: "Cadmium Orange", hex: "#E58423", colSpan: "col-span-2", textColor: "black" },
      { name: "Golf (Crayola)", hex: "#E8C581", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Luxury Color 5",
    colors: [
      { name: "Gochujang Red", hex: "#780001", colSpan: "col-span-3", textColor: "white" },
      { name: "Crimson Blaze", hex: "#C1121F", colSpan: "col-span-1", textColor: "white" },
      { name: "Varden", hex: "#FEF0D5", colSpan: "col-span-2", textColor: "black" },
      { name: "Cosmos Blue", hex: "#002F49", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Luxury Color 4",
    colors: [
      { name: "Deep", hex: "182350", colSpan: "col-span-3", textColor: "white" },
      { name: "Powder", hex: "AFD2FA", colSpan: "col-span-1", textColor: "white" },
      { name: "Floral", hex: "FEFAEF", colSpan: "col-span-2", textColor: "white" },
      { name: "Pale", hex: "B9915E", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Cyber Neon",
    colors: [
      { name: "Void", hex: "#09090B", colSpan: "col-span-3", textColor: "white" },
      { name: "Neon Green", hex: "#00FF41", colSpan: "col-span-1", textColor: "black" },
      { name: "Acid Yellow", hex: "#E5FF00", colSpan: "col-span-2", textColor: "black" },
      { name: "Digital Pink", hex: "#FF00AA", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Blueprint",
    colors: [
      { name: "Paper", hex: "#F3F4F6", colSpan: "col-span-3", textColor: "black" },
      { name: "Draft Blue", hex: "#2563EB", colSpan: "col-span-1", textColor: "white" },
      { name: "Grid Line", hex: "#93C5FD", colSpan: "col-span-2", textColor: "black" },
      { name: "Navy Ink", hex: "#1E3A8A", colSpan: "col-span-3", textColor: "white" },
    ],
  },
];
