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
      { name: "Maroon", hex: "#810100", colSpan: "col-span-1", textColor: "white" },
      { name: "Blood Red", hex: "#630102", colSpan: "col-span-2", textColor: "white" },
      { name: "Black Chocolate", hex: "#1B1716", colSpan: "col-span-3", textColor: "white" },
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
    name: "After the Show",
    colors: [
      { name: "Deep Claret", hex: "#4E0420", colSpan: "col-span-3", textColor: "white" },
      { name: "Burgundy", hex: "#870E32", colSpan: "col-span-1", textColor: "white" },
      { name: "Platinum", hex: "#E8E7E6", colSpan: "col-span-2", textColor: "black" },
      { name: "Timberwolf", hex: "#C7BEBA", colSpan: "col-span-2", textColor: "black" },
      { name: "Taupe Gray", hex: "#90898A", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Dried Roses",
    colors: [
      { name: "Dark Plum", hex: "#1E0B10", colSpan: "col-span-3", textColor: "white" },
      { name: "Old Rose", hex: "#50212B", colSpan: "col-span-1", textColor: "white" },
      { name: "Dusty Rose", hex: "#755058", colSpan: "col-span-2", textColor: "white" },
      { name: "Silver Chalice", hex: "#C4C1B9", colSpan: "col-span-2", textColor: "black" },
      { name: "Alabaster", hex: "#ECE9E1", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Opera",
    colors: [
      { name: "Midnight Violet", hex: "#140C22", colSpan: "col-span-3", textColor: "white" },
      { name: "Deep Indigo", hex: "#242150", colSpan: "col-span-1", textColor: "white" },
      { name: "Slate Blue", hex: "#494F76", colSpan: "col-span-2", textColor: "white" },
      { name: "Parchment", hex: "#E6E1D4", colSpan: "col-span-2", textColor: "black" },
      { name: "Carmine Red", hex: "#790713", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Luxury",
    colors: [
      { name: "Col", hex: "182350", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "AFD2FA", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "FEFAEF", colSpan: "col-span-2", textColor: "white" },
      { name: "col", hex: "B9915E", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "B9915E", colSpan: "col-span-1", textColor: "black" },
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
