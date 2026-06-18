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
    name: "Palace Library",
    colors: [
      { name: "Col", hex: "#5A1616", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#B9A674", colSpan: "col-span-1", textColor: "black" },
      { name: "col", hex: "#EAE6DB", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#DCD4B9", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#2E5064", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Old Bordeaux",
    colors: [
      { name: "Col", hex: "#4E0B0C", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#6A494A", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#D1C6B0", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#F0EDE7", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#C7D4DF", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Forest Study",
    colors: [
      { name: "Col", hex: "#16191D", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#224141", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#486664", colSpan: "col-span-2", textColor: "white" },
      { name: "col", hex: "#E9E5DD", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#C3B388", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Sunday Wool",
    colors: [
      { name: "Col", hex: "#2D211E", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#584A49", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#8D867C", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#C8BEB3", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#F4F1EA", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "The Vienna Cafe",
    colors: [
      { name: "Col", hex: "#2D1925", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#592C39", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#C8C4AE", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#ECE9E2", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#2C5760", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "The Library",
    colors: [
      { name: "Col", hex: "#4E0B0C", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#6A494A", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#D1C6B0", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#F0EDE7", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#C7D4DF", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Grand Hotel",
    colors: [
      { name: "Col", hex: "#4F0402", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#6B4D4E", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#DEE6E8", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#B1C5C8", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#7992A2", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "English Garden",
    colors: [
      { name: "Col", hex: "#21362D", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#83887B", colSpan: "col-span-1", textColor: "black" },
      { name: "col", hex: "#C4C5AF", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#EAE8DD", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#842B37", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Wine & Leather",
    colors: [
      { name: "Col", hex: "#251111", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#720D1A", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#B08C48", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#C3B7A5", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#E6E2D7", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Royal Academy",
    colors: [
      { name: "Col", hex: "#0E1625", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#303E64", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#EEECE0", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#DCD3A8", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#B9A14E", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "The Yacht",
    colors: [
      { name: "Col", hex: "#0D0807", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#122256", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#8EA0B5", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#F2F1EB", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#DCDACC", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "North Sea",
    colors: [
      { name: "Col", hex: "#0D2D4B", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#A38F70", colSpan: "col-span-1", textColor: "black" },
      { name: "col", hex: "#EAEBEC", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#B6C7C7", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#3E787C", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "colo",
    colors: [
      { name: "Col", hex: "#102B1E", colSpan: "col-span-3", textColor: "white" },
      { name: "Col", hex: "#375D4B", colSpan: "col-span-1", textColor: "white" },
      { name: "col", hex: "#E8E5D8", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#D7C8A5", colSpan: "col-span-2", textColor: "black" },
      { name: "col", hex: "#B1975C", colSpan: "col-span-1", textColor: "black" },
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
