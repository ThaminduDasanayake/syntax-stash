export type Colors = {
  name: string;
  hex: string;
  colSpan?: string;
  textColor?: "white" | "black";
};

export type Palette = {
  name: string;
  colors: Colors[];
};

/* eslint-disable perfectionist/sort-objects, perfectionist/sort-arrays */

export const COLOR_PALETTES: Palette[] = [
  {
    name: "Neon Ember",
    colors: [
      {
        name: "Neon Coral",
        hex: "#FF6044",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Space Black",
        hex: "#121313",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
    ],
  },
  {
    name: "Linen & Clay",
    colors: [
      {
        name: "Ivory",
        hex: "#FFF2E1",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
      {
        name: "Donkey Brown",
        hex: "#A79277",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
    ],
  },
  {
    name: "Atlantic Fog",
    colors: [
      {
        name: "Mist Gray",
        hex: "#ECEFF1",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
      {
        name: "Midnight Blue",
        hex: "#191970",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
    ],
  },
  {
    name: "Cherry Custard",
    colors: [
      {
        name: "Cherry Red",
        hex: "#FF4747",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Butter Yellow",
        hex: "#F7E998",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Spruce & Champagne",
    colors: [
      {
        name: "Deep Forest",
        hex: "#102C26",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Champagne",
        hex: "#F7E7CE",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Plum & Sandalwood",
    colors: [
      { name: "Golden Sandlewood", hex: "#857861", colSpan: "col-span-3", textColor: "white" },
      { name: "Almond Light", hex: "#E7D4BB", colSpan: "col-span-1", textColor: "black" },
      { name: "Plum Wine", hex: "#48252F", colSpan: "col-span-2", textColor: "white" },
      { name: "Carbon Powder", hex: "#101211", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Gilded Navy",
    colors: [
      { name: "Alabaster White", hex: "#F7F3E9", colSpan: "col-span-3", textColor: "black" },
      { name: "Metallic Brass", hex: "#D4AF37", colSpan: "col-span-1", textColor: "black" },
      { name: "Steel Navy", hex: "#415A77", colSpan: "col-span-2", textColor: "white" },
      { name: "Deep Sapphire", hex: "#0D1B2A", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Old Cartography",
    colors: [
      { name: "Pale", hex: "#E8D9C4", colSpan: "col-span-3", textColor: "black" },
      { name: "Gold", hex: "#785D32", colSpan: "col-span-1", textColor: "white" },
      { name: "Rough", hex: "#3E160C", colSpan: "col-span-2", textColor: "white" },
      { name: "Off-Navy", hex: "#050A30", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Winter Conservatory",
    colors: [
      { name: "Warm Alabaster", hex: "#E9E0CF", colSpan: "col-span-3", textColor: "black" },
      { name: "Antique Gold", hex: "#BA9B5F", colSpan: "col-span-1", textColor: "black" },
      { name: "Sage Green", hex: "#5E775E", colSpan: "col-span-2", textColor: "white" },
      { name: "Dark Forest Green", hex: "#132B23", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Rouge Atelier",
    colors: [
      { name: "Crimson Depth", hex: "#710014", colSpan: "col-span-3", textColor: "white" },
      { name: "Warm Sand", hex: "#B38F6F", colSpan: "col-span-1", textColor: "white" },
      { name: "Soft Pearl", hex: "#F2F1ED", colSpan: "col-span-2", textColor: "black" },
      { name: "Obsidian Black", hex: "#161616", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Crimson Elegance",
    colors: [
      { name: "Cotton", hex: "#EDEBDE", colSpan: "col-span-3", textColor: "black" },
      { name: "Maroon", hex: "#810100", colSpan: "col-span-1", textColor: "white" },
      { name: "Blood Red", hex: "#630102", colSpan: "col-span-2", textColor: "white" },
      { name: "Black Chocolate", hex: "#1B1716", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Emerald Forest",
    colors: [
      { name: "Deep Bluish", hex: "#0D3A35", colSpan: "col-span-3", textColor: "white" },
      { name: "Moderate Green", hex: "#276152", colSpan: "col-span-1", textColor: "white" },
      { name: "Laurel Green", hex: "#B1B7AB", colSpan: "col-span-2", textColor: "black" },
      { name: "Light Cream", hex: "#FBF6F0", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Sapphire Sands",
    colors: [
      { name: "Deep Blue", hex: "#182350", colSpan: "col-span-3", textColor: "white" },
      { name: "Powder Blue", hex: "#AFD2FA", colSpan: "col-span-1", textColor: "black" },
      { name: "Floral White", hex: "#FEFAEF", colSpan: "col-span-2", textColor: "black" },
      { name: "Pale Brown", hex: "#B9915E", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Autumn Harvest",
    colors: [
      { name: "Black Bean", hex: "#3D1202", colSpan: "col-span-3", textColor: "white" },
      { name: "Mahogany", hex: "#BA3D03", colSpan: "col-span-1", textColor: "white" },
      { name: "Cadmium Orange", hex: "#E58423", colSpan: "col-span-2", textColor: "black" },
      { name: "Golf (Crayola)", hex: "#E8C581", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Midnight Crimson",
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
      { name: "Vintage Leather", hex: "#5A1616", colSpan: "col-span-3", textColor: "white" },
      { name: "Aged Gold", hex: "#B9A674", colSpan: "col-span-1", textColor: "black" },
      { name: "Old Page", hex: "#EAE6DB", colSpan: "col-span-2", textColor: "black" },
      { name: "Dusty Tome", hex: "#DCD4B9", colSpan: "col-span-2", textColor: "black" },
      { name: "Ink Well", hex: "#2E5064", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Old Bordeaux",
    colors: [
      { name: "Aged Wine", hex: "#4E0B0C", colSpan: "col-span-3", textColor: "white" },
      { name: "Faded Rose", hex: "#6A494A", colSpan: "col-span-1", textColor: "white" },
      { name: "Pale Stone", hex: "#D1C6B0", colSpan: "col-span-2", textColor: "black" },
      { name: "Alabaster", hex: "#F0EDE7", colSpan: "col-span-2", textColor: "black" },
      { name: "Muted Slate", hex: "#C7D4DF", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Forest Study",
    colors: [
      { name: "Midnight Wood", hex: "#16191D", colSpan: "col-span-3", textColor: "white" },
      { name: "Deep Pine", hex: "#224141", colSpan: "col-span-1", textColor: "white" },
      { name: "Mossy Oak", hex: "#486664", colSpan: "col-span-2", textColor: "white" },
      { name: "Birch Bark", hex: "#E9E5DD", colSpan: "col-span-2", textColor: "black" },
      { name: "Dry Leaf", hex: "#C3B388", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Sunday Wool",
    colors: [
      { name: "Dark Cocoa", hex: "#2D211E", colSpan: "col-span-3", textColor: "white" },
      { name: "Warm Taupe", hex: "#584A49", colSpan: "col-span-1", textColor: "white" },
      { name: "Heather Gray", hex: "#8D867C", colSpan: "col-span-2", textColor: "black" },
      { name: "Cashmere", hex: "#C8BEB3", colSpan: "col-span-2", textColor: "black" },
      { name: "Cream Wool", hex: "#F4F1EA", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "The Vienna Cafe",
    colors: [
      { name: "Espresso", hex: "#2D1925", colSpan: "col-span-3", textColor: "white" },
      { name: "Plum Pastry", hex: "#592C39", colSpan: "col-span-1", textColor: "white" },
      { name: "Pistachio", hex: "#C8C4AE", colSpan: "col-span-2", textColor: "black" },
      { name: "Meringue", hex: "#ECE9E2", colSpan: "col-span-2", textColor: "black" },
      { name: "Teal Cup", hex: "#2C5760", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "The Library",
    colors: [
      { name: "Oxblood Bind", hex: "#4E0B0C", colSpan: "col-span-3", textColor: "white" },
      { name: "Dusty Cover", hex: "#6A494A", colSpan: "col-span-1", textColor: "white" },
      { name: "Parchment", hex: "#D1C6B0", colSpan: "col-span-2", textColor: "black" },
      { name: "Blank Page", hex: "#F0EDE7", colSpan: "col-span-2", textColor: "black" },
      { name: "Slate Shelf", hex: "#C7D4DF", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Grand Hotel",
    colors: [
      { name: "Velvet Curtain", hex: "#4F0402", colSpan: "col-span-3", textColor: "white" },
      { name: "Rose Wood", hex: "#6B4D4E", colSpan: "col-span-1", textColor: "white" },
      { name: "Ice Water", hex: "#DEE6E8", colSpan: "col-span-2", textColor: "black" },
      { name: "Morning Fog", hex: "#B1C5C8", colSpan: "col-span-2", textColor: "black" },
      { name: "Steel Gray", hex: "#7992A2", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "English Garden",
    colors: [
      { name: "Evergreen", hex: "#21362D", colSpan: "col-span-3", textColor: "white" },
      { name: "Stone Path", hex: "#83887B", colSpan: "col-span-1", textColor: "black" },
      { name: "Sage Bush", hex: "#C4C5AF", colSpan: "col-span-2", textColor: "black" },
      { name: "Marble Birdbath", hex: "#EAE8DD", colSpan: "col-span-2", textColor: "black" },
      { name: "Red Rose", hex: "#842B37", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Wine & Leather",
    colors: [
      { name: "Dark Mahogany", hex: "#251111", colSpan: "col-span-3", textColor: "white" },
      { name: "Cabernet", hex: "#720D1A", colSpan: "col-span-1", textColor: "white" },
      { name: "Brass Buckle", hex: "#B08C48", colSpan: "col-span-2", textColor: "black" },
      { name: "Tan Leather", hex: "#C3B7A5", colSpan: "col-span-2", textColor: "black" },
      { name: "White Linen", hex: "#E6E2D7", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Royal Academy",
    colors: [
      { name: "Midnight Blue", hex: "#0E1625", colSpan: "col-span-3", textColor: "white" },
      { name: "Navy Coat", hex: "#303E64", colSpan: "col-span-1", textColor: "white" },
      { name: "Chalk", hex: "#EEECE0", colSpan: "col-span-2", textColor: "black" },
      { name: "Gold Leaf", hex: "#DCD3A8", colSpan: "col-span-2", textColor: "black" },
      { name: "Antique Brass", hex: "#B9A14E", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "The Yacht",
    colors: [
      { name: "Deep Sea", hex: "#0D0807", colSpan: "col-span-3", textColor: "white" },
      { name: "Nautical Navy", hex: "#122256", colSpan: "col-span-1", textColor: "white" },
      { name: "Sail Canvas", hex: "#8EA0B5", colSpan: "col-span-2", textColor: "black" },
      { name: "White Deck", hex: "#F2F1EB", colSpan: "col-span-2", textColor: "black" },
      { name: "Sandstone", hex: "#DCDACC", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "North Sea",
    colors: [
      { name: "Ocean Depths", hex: "#0D2D4B", colSpan: "col-span-3", textColor: "white" },
      { name: "Driftwood", hex: "#A38F70", colSpan: "col-span-1", textColor: "black" },
      { name: "Sea Foam", hex: "#EAEBEC", colSpan: "col-span-2", textColor: "black" },
      { name: "Frost Blue", hex: "#B6C7C7", colSpan: "col-span-2", textColor: "black" },
      { name: "Teal Wave", hex: "#3E787C", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Malibu Postcard",
    colors: [
      { name: "Pacific Blue", hex: "#058FDA", colSpan: "col-span-3", textColor: "black" },
      { name: "Hot Pink", hex: "#FF6DCA", colSpan: "col-span-1", textColor: "black" },
      { name: "Bubblegum", hex: "#FFB6DD", colSpan: "col-span-2", textColor: "black" },
      { name: "Sun Bleached", hex: "#FDFCEF", colSpan: "col-span-2", textColor: "black" },
      { name: "Lemon Sun", hex: "#FFF064", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Aperol Hour",
    colors: [
      { name: "Pool Tile", hex: "#1E9DAC", colSpan: "col-span-3", textColor: "white" },
      { name: "Lemon Wedge", hex: "#F0E1A9", colSpan: "col-span-1", textColor: "black" },
      { name: "White Sand", hex: "#F6F4EE", colSpan: "col-span-2", textColor: "black" },
      { name: "Peach Sorbet", hex: "#EBB898", colSpan: "col-span-2", textColor: "black" },
      { name: "Spritz Orange", hex: "#FF8B48", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Tokyo Arcade",
    colors: [
      { name: "Cyan Glow", hex: "#01B3C9", colSpan: "col-span-3", textColor: "black" },
      { name: "Pixel Green", hex: "#16D37B", colSpan: "col-span-1", textColor: "black" },
      { name: "Cloud White", hex: "#EBF4F8", colSpan: "col-span-2", textColor: "black" },
      { name: "Sakura Pink", hex: "#FFBFCF", colSpan: "col-span-2", textColor: "black" },
      { name: "Neon Pink", hex: "#FF9ACC", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Beach Towel",
    colors: [
      { name: "Tropical Green", hex: "#009E81", colSpan: "col-span-3", textColor: "black" },
      { name: "Aqua Splash", hex: "#94E0DD", colSpan: "col-span-1", textColor: "black" },
      { name: "Sand Dollar", hex: "#F5F9EB", colSpan: "col-span-2", textColor: "black" },
      { name: "Sun Beam", hex: "#FFE680", colSpan: "col-span-2", textColor: "black" },
      { name: "Coral Pink", hex: "#FF7079", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Harbour Morning",
    colors: [
      { name: "Harbor Blue", hex: "#2A617D", colSpan: "col-span-3", textColor: "white" },
      { name: "Morning Sky", hex: "#8DC2DB", colSpan: "col-span-1", textColor: "black" },
      { name: "Lighthouse White", hex: "#F8F6F0", colSpan: "col-span-2", textColor: "black" },
      { name: "Dune Grass", hex: "#ECD89E", colSpan: "col-span-2", textColor: "black" },
      { name: "Wet Sand", hex: "#BA9D84", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Beach Umbrella",
    colors: [
      { name: "Sunset Orange", hex: "#FD9731", colSpan: "col-span-3", textColor: "black" },
      { name: "Mango Popsicle", hex: "#FFC068", colSpan: "col-span-1", textColor: "black" },
      { name: "White Canvas", hex: "#EDEEEF", colSpan: "col-span-2", textColor: "black" },
      { name: "Sky Blue", hex: "#BFD7E0", colSpan: "col-span-2", textColor: "black" },
      { name: "Clear Water", hex: "#1DBFEC", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Ice Cream Truck",
    colors: [
      { name: "Blue Raspberry", hex: "#075BB4", colSpan: "col-span-3", textColor: "white" },
      { name: "Mint Chip", hex: "#93DBE3", colSpan: "col-span-1", textColor: "black" },
      { name: "Vanilla Bean", hex: "#E4EFEE", colSpan: "col-span-2", textColor: "black" },
      { name: "Strawberry", hex: "#FDBCDC", colSpan: "col-span-2", textColor: "black" },
      { name: "Orange Sherbet", hex: "#FF7653", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Fishing Village",
    colors: [
      { name: "Red Buoy", hex: "#E85314", colSpan: "col-span-3", textColor: "white" },
      { name: "Salmon Catch", hex: "#ED9D73", colSpan: "col-span-1", textColor: "black" },
      { name: "Morning Mist", hex: "#C7D7E1", colSpan: "col-span-2", textColor: "black" },
      { name: "Dock Wood", hex: "#F2F1ED", colSpan: "col-span-2", textColor: "black" },
      { name: "Yellow Raincoat", hex: "#EAC53D", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Greek Island",
    colors: [
      { name: "Ancient Stone", hex: "#BEAA93", colSpan: "col-span-3", textColor: "black" },
      { name: "Olive Branch", hex: "#DACDBB", colSpan: "col-span-1", textColor: "black" },
      { name: "Whitewash", hex: "#F9F8F0", colSpan: "col-span-2", textColor: "black" },
      { name: "Aegean Sea", hex: "#CBE4E2", colSpan: "col-span-2", textColor: "black" },
      { name: "Turquoise Dome", hex: "#88CDCD", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Gelateria",
    colors: [
      { name: "Cherry Gelato", hex: "#DB4052", colSpan: "col-span-3", textColor: "black" },
      { name: "Pink Wafer", hex: "#FFA0AC", colSpan: "col-span-1", textColor: "black" },
      { name: "Lavender Cream", hex: "#EECAEA", colSpan: "col-span-2", textColor: "black" },
      { name: "Vanilla Ice", hex: "#E9F8F9", colSpan: "col-span-2", textColor: "black" },
      { name: "Mint Sorbet", hex: "#16C1C4", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Portofino",
    colors: [
      { name: "Terracotta", hex: "#D35526", colSpan: "col-span-3", textColor: "white" },
      { name: "Lemon Grove", hex: "#FDAF54", colSpan: "col-span-1", textColor: "black" },
      { name: "Limestone", hex: "#F5F3EB", colSpan: "col-span-2", textColor: "black" },
      { name: "Riviera Blue", hex: "#6CB6E4", colSpan: "col-span-2", textColor: "black" },
      { name: "Deep Harbor", hex: "#387CA3", colSpan: "col-span-1", textColor: "white" },
    ],
  },
  {
    name: "Rainbow Ice Pop",
    colors: [
      { name: "Cherry Red", hex: "#F62024", colSpan: "col-span-3", textColor: "black" },
      { name: "Pink Lemonade", hex: "#FF6F91", colSpan: "col-span-1", textColor: "black" },
      { name: "Sugar White", hex: "#F8F9F1", colSpan: "col-span-2", textColor: "black" },
      { name: "Lime Green", hex: "#E0F973", colSpan: "col-span-2", textColor: "black" },
      { name: "Blue Slush", hex: "#9DD6FA", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Picnic Park",
    colors: [
      { name: "Denim Blanket", hex: "#496BBA", colSpan: "col-span-3", textColor: "white" },
      { name: "Clear Sky", hex: "#B7D7FA", colSpan: "col-span-1", textColor: "black" },
      { name: "Paper Plate", hex: "#F0FAFC", colSpan: "col-span-2", textColor: "black" },
      { name: "Mustard", hex: "#E6EC43", colSpan: "col-span-2", textColor: "black" },
      { name: "Fresh Grass", hex: "#88CB02", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Coral Reef",
    colors: [
      { name: "Deep Teal", hex: "#006669", colSpan: "col-span-3", textColor: "white" },
      { name: "Ocean Current", hex: "#159CBA", colSpan: "col-span-1", textColor: "white" },
      { name: "Sea Shell", hex: "#F9F5F3", colSpan: "col-span-2", textColor: "black" },
      { name: "Pink Coral", hex: "#FEC7C1", colSpan: "col-span-2", textColor: "black" },
      { name: "Orange Anemone", hex: "#FF714E", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Mexican Garden",
    colors: [
      { name: "Agave Green", hex: "#1D854C", colSpan: "col-span-3", textColor: "white" },
      { name: "Marigold", hex: "#F9CC39", colSpan: "col-span-1", textColor: "black" },
      { name: "Stucco", hex: "#F2F3E8", colSpan: "col-span-2", textColor: "black" },
      { name: "Hibiscus Pink", hex: "#FA9EAC", colSpan: "col-span-2", textColor: "black" },
      { name: "Bougainvillea", hex: "#F4408B", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Cosmic Carnival",
    colors: [
      { name: "Grape Violet", hex: "#38194C", colSpan: "col-span-3", textColor: "white" },
      { name: "Dark Raspberry", hex: "#941E43", colSpan: "col-span-1", textColor: "white" },
      { name: "Cinnabar", hex: "#E54F29", colSpan: "col-span-2", textColor: "black" },
      { name: "Pizazz", hex: "#F88F05", colSpan: "col-span-2", textColor: "black" },
      { name: "Bright Sun", hex: "#FFD03B", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Midnight Terracotta",
    colors: [
      { name: "Stygian", hex: "#191E23", colSpan: "col-span-3", textColor: "white" },
      { name: "Smalt Blue", hex: "#5A838F", colSpan: "col-span-1", textColor: "white" },
      { name: "Virgin Lace", hex: "#F0EDDC", colSpan: "col-span-2", textColor: "black" },
      { name: "Cute Brown", hex: "#C6A498", colSpan: "col-span-2", textColor: "black" },
      { name: "Fiery Coral", hex: "#E85C2D", colSpan: "col-span-1", textColor: "black" },
    ],
  },
  {
    name: "Electric Flora",
    colors: [
      {
        name: "Praxeti White",
        hex: "#F6F7ED",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Midnight Mirage",
        hex: "#001F3F",
        colSpan: "col-span-1 row-span-2",
        textColor: "white",
      },
      {
        name: "Spring",
        hex: "#DBE64C",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
      {
        name: "Mantis",
        hex: "#74C365",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
      {
        name: "Book Green",
        hex: "#00804C",
        colSpan: "col-span-2 row-span-1",
        textColor: "white",
      },
      {
        name: "Nuit Blanche",
        hex: "#1E488F",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
    ],
  },
  {
    name: "Spice Bazaar",
    colors: [
      {
        name: "Yoghurt",
        hex: "#F5E9CE",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Vivid Orange",
        hex: "#FFA102",
        colSpan: "col-span-1 row-span-2",
        textColor: "black",
      },
      {
        name: "Her Highness",
        hex: "#432E6F",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
      {
        name: "Frozen Tomato",
        hex: "#DD5533",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
      {
        name: "Ginshu",
        hex: "#BC2D29",
        colSpan: "col-span-2 row-span-1",
        textColor: "white",
      },
      {
        name: "Rum Chocolate",
        hex: "#450E16",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
    ],
  },
  {
    name: "Glacial Flare",
    colors: [
      {
        name: "Morning Snow",
        hex: "#F5F4ED",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Amazon Mist",
        hex: "#ECECDC",
        colSpan: "col-span-1 row-span-2",
        textColor: "black",
      },
      {
        name: "Black Kite",
        hex: "#351E1C",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
      {
        name: "Aqua Mist",
        hex: "#A0C9CB",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
      {
        name: "Toxic Orange",
        hex: "#FF6037",
        colSpan: "col-span-2 row-span-1",
        textColor: "white",
      },
      {
        name: "Garnet",
        hex: "#733635",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
    ],
  },
  {
    name: "Kyoto Dusk",
    colors: [
      {
        name: "Cloud Dancer",
        hex: "#F0EEE9",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Duranta Yellow",
        hex: "#D8E63C",
        colSpan: "col-span-1 row-span-2",
        textColor: "black",
      },
      {
        name: "Tetsu-kon Blue",
        hex: "#17184B",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
      {
        name: "Nordic Breeze",
        hex: "#D3DDE7",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
      {
        name: "Hermes",
        hex: "#293288",
        colSpan: "col-span-2 row-span-1",
        textColor: "white",
      },
      {
        name: "Light Violet",
        hex: "#D6B4FC",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
    ],
  },
  {
    name: "Saffron Shore",
    colors: [
      {
        name: "Arctic Powder",
        hex: "#F1F6F4",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Forsytha",
        hex: "#FFC801",
        colSpan: "col-span-1 row-span-2",
        textColor: "black",
      },
      {
        name: "Nocturnal",
        hex: "#114C5A",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
      {
        name: "Mystic Mint",
        hex: "#D9E8E2",
        colSpan: "col-span-1 row-span-1",
        textColor: "black",
      },
      {
        name: "Deep Saffron",
        hex: "#FF9932",
        colSpan: "col-span-2 row-span-1",
        textColor: "black",
      },
      {
        name: "Oceanic Noir",
        hex: "#172B36",
        colSpan: "col-span-1 row-span-1",
        textColor: "white",
      },
    ],
  },
  {
    name: "Volcanic Glow",
    colors: [
      {
        name: "Raisin Black",
        hex: "#202322",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      { name: "Fire Opal", hex: "#EF6448", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Scarlet & Linen",
    colors: [
      { name: "Ferrari Red", hex: "#EA2E00", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Chenille Spread",
        hex: "#F0E7D6",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Royal Frost",
    colors: [
      {
        name: "Princess Blue",
        hex: "#015AA0",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "American Silver",
        hex: "#ECECFF",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Deep Sea Mint",
    colors: [
      {
        name: "Daintree Green",
        hex: "#052A30",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Neo Mint Green",
        hex: "#A7FFDC",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Silk & Steel",
    colors: [
      { name: "Steel Gray", hex: "#282433", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "White Chocolate",
        hex: "#F3E0D9",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Blackberry & Guava",
    colors: [
      {
        name: "Chinese Black",
        hex: "#0E0928",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Watermelon Pink",
        hex: "#FF7E9E",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Cosmic Lilac",
    colors: [
      { name: "Beyond Navy", hex: "#0F0E49", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Sweet Memories",
        hex: "#D5A5E3",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Celadon & Indigo",
    colors: [
      { name: "Blue Zodiac", hex: "#14305F", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Tea Green", hex: "#D6FEC3", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Sunbaked Clay",
    colors: [
      { name: "Ochre", hex: "#D08327", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Floral White",
        hex: "#FEFBF2",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Rosewood & Cream",
    colors: [
      { name: "Cornsilk", hex: "#FFF8DC", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Rose Ebony", hex: "#674846", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Eucalyptus Shade",
    colors: [
      {
        name: "Midnight Green",
        hex: "#194342",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      { name: "Tea Green", hex: "#DAE8B3", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Claret & Blush",
    colors: [
      {
        name: "Lavender Blush",
        hex: "#FFF0F5",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
      { name: "Claret", hex: "#7F1635", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Twilight Horizon",
    colors: [
      { name: "Night Sky", hex: "#40415D", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Blue Sky", hex: "#DDDFEE", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Lavender Quartz",
    colors: [
      { name: "Ghost White", hex: "#F8F9FE", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Amethyst", hex: "#A371D0", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Miami Tropic",
    colors: [
      { name: "Mint", hex: "#66D0BC", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Flamingo", hex: "#FF3E9B", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Azure & Scarlet",
    colors: [
      { name: "Côte d'Azur", hex: "#98D2EB", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Matador", hex: "#E12826", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Golden Papaya",
    colors: [
      { name: "Warm Orange", hex: "#B95712", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Dusty Yellow",
        hex: "#F9D190",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Midnight Periwinkle",
    colors: [
      {
        name: "Obsidian Black",
        hex: "#0F0F0F",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Dream Lavender",
        hex: "#8F9AE8",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Roasted Terracotta",
    colors: [
      {
        name: "Espresso Noir",
        hex: "#1E1415",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Terracotta Clay",
        hex: "#D8735E",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Wilderness Ochre",
    colors: [
      { name: "Forest Moss", hex: "#1C2814", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Golden Ochre",
        hex: "#BF8E34",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Polar Twilight",
    colors: [
      { name: "Deep Ocean", hex: "#011B4C", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Glacier Gray",
        hex: "#B3BDD6",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Sedona Sand",
    colors: [
      { name: "Rust Ember", hex: "#96351E", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Desert Sand", hex: "#DBB98F", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Black Orchid",
    colors: [
      { name: "Jet Black", hex: "#1D1D1D", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Orchid", hex: "#E5BDDF", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Sea Glass & Ash",
    colors: [
      { name: "Wine Ash", hex: "#32292F", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Turquoise", hex: "#99E1D9", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Electric Mint & Noir",
    colors: [
      { name: "Tiffany", hex: "#21F1A8", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Dark Gray", hex: "#171717", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Candy Glaze",
    colors: [
      { name: "True Pink", hex: "#FD1843", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Chill White", hex: "#FFF9FA", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Cyberpunk Violet",
    colors: [
      {
        name: "Charcoal Violet",
        hex: "#3C1A47",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      { name: "Cyber Line", hex: "#B6FF00", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Cyprus Coast",
    colors: [
      { name: "Cyprus", hex: "#004741", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Sand", hex: "#F0EDE4", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Canopy Dew",
    colors: [
      { name: "Lime Sprout", hex: "#E4FD97", colSpan: "col-span-3 row-span-3", textColor: "black" },
      {
        name: "Fresh Canopy",
        hex: "#2D3E2C",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
    ],
  },
  {
    name: "Matcha Milk",
    colors: [
      { name: "Milky", hex: "#FFFDF1", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Mantis", hex: "#59C749", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Turmeric Latte",
    colors: [
      { name: "Turmeric", hex: "#FFBE0B", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Malt", hex: "#2A2312", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Matrix Glow",
    colors: [
      { name: "Sport Black", hex: "#141414", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Luminous Moss",
        hex: "#2BEE34",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Ember Depths",
    colors: [
      { name: "Vulcanico", hex: "#FF4103", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Noturno", hex: "#001621", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Blush & Merlot",
    colors: [
      { name: "Skin Tone", hex: "#FFC6A8", colSpan: "col-span-3 row-span-3", textColor: "black" },
      { name: "Bridal", hex: "#741A2F", colSpan: "col-span-3 row-span-3", textColor: "white" },
    ],
  },
  {
    name: "Arctic Pearl",
    colors: [
      { name: "Arctic Teal", hex: "#0E7490", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Cloud Pearl", hex: "#F2F5F7", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Sahara Bloom",
    colors: [
      {
        name: "Terracotta Bloom",
        hex: "#C96A4A",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      { name: "Sand Dune", hex: "#EEDCC8", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Woodland Cream",
    colors: [
      { name: "Forest Moss", hex: "#4E6B45", colSpan: "col-span-3 row-span-3", textColor: "white" },
      {
        name: "Vanilla Silk",
        hex: "#F4E8D0",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Wisteria Twilight",
    colors: [
      {
        name: "Indigo Night",
        hex: "#2D4275",
        colSpan: "col-span-3 row-span-3",
        textColor: "white",
      },
      {
        name: "Wisteria Glow",
        hex: "#D6C6F7",
        colSpan: "col-span-3 row-span-3",
        textColor: "black",
      },
    ],
  },
  {
    name: "Mulberry Clay",
    colors: [
      { name: "Berry Plum", hex: "#683557", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Blush Clay", hex: "#E9C1B7", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Glacier Onyx",
    colors: [
      { name: "Onyx", hex: "#020202", colSpan: "col-span-3 row-span-3", textColor: "white" },
      { name: "Candy Blue", hex: "#B2D5E5", colSpan: "col-span-3 row-span-3", textColor: "black" },
    ],
  },
  {
    name: "Valencia Grove",
    colors: [
      { name: "Tangerine", hex: "#F58F20", colSpan: "col-span-3", textColor: "black" },
      { name: "Leaf Green", hex: "#467434", colSpan: "col-span-3", textColor: "white" },
      { name: "Sea Gray", hex: "#363636", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Alpine Monarch",
    colors: [
      { name: "Ice White", hex: "#F4FEFF", colSpan: "col-span-3", textColor: "black" },
      { name: "Powder Blue", hex: "#A9C0E0", colSpan: "col-span-3", textColor: "black" },
      { name: "Royal Blue", hex: "#0E2F76", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Capri Marina",
    colors: [
      { name: "Aqua", hex: "#95D9C0", colSpan: "col-span-3", textColor: "black" },
      { name: "Blanc", hex: "#FFFFFF", colSpan: "col-span-3", textColor: "black" },
      { name: "Carmin", hex: "#D41F26", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Abyssal Twilight",
    colors: [
      { name: "Midnight Blue", hex: "#001A4B", colSpan: "col-span-3", textColor: "white" },
      { name: "Cobalt Blue", hex: "#04326D", colSpan: "col-span-3", textColor: "white" },
      { name: "Mist Blue", hex: "#B2BED6", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Mojave Twilight",
    colors: [
      { name: "Charcoal Navy", hex: "#27262E", colSpan: "col-span-3", textColor: "white" },
      { name: "Sandy Tan", hex: "#E19C63", colSpan: "col-span-3", textColor: "black" },
      { name: "Dusty Steel Blue", hex: "#8BA5BE", colSpan: "col-span-3", textColor: "black" },
    ],
  },
  {
    name: "Wild Iris",
    colors: [
      { name: "Moss Green", hex: "#8F9D68", colSpan: "col-span-3", textColor: "white" },
      { name: "Old Lace", hex: "#FFF8EB", colSpan: "col-span-3", textColor: "black" },
      { name: "Iris", hex: "#7A57CD", colSpan: "col-span-3", textColor: "white" },
    ],
  },
  {
    name: "Amalfi Splash",
    colors: [
      { name: "Deep Teal", hex: "#0F506D", colSpan: "col-span-3", textColor: "white" },
      { name: "Ocean Blue", hex: "#1E7F98", colSpan: "row-span-2", textColor: "white" },
      { name: "Lemon Glow", hex: "#F2D24B", colSpan: "col-span-2", textColor: "black" },
      { name: "Citrus Orange", hex: "#F39A1E", colSpan: "col-span-2", textColor: "black" },
    ],
  },
  {
    name: "Berry Patisserie",
    colors: [
      { name: "Soft Pink", hex: "#F6B7C8", colSpan: "col-span-3", textColor: "black" },
      { name: "Light Cream", hex: "#FFE6EE", colSpan: "row-span-2", textColor: "black" },
      { name: "Berry Red", hex: "#C81D4F", colSpan: "col-span-2", textColor: "white" },
      { name: "Cone Beige", hex: "#C98A57", colSpan: "col-span-2", textColor: "black" },
    ],
  },
  {
    name: "Santorini Sun",
    colors: [
      { name: "Sunflower Yellow", hex: "#F2C400", colSpan: "col-span-3", textColor: "black" },
      { name: "Aegean Blue", hex: "#0077C8", colSpan: "row-span-2", textColor: "white" },
      { name: "Olive Green", hex: "#48681F", colSpan: "col-span-2", textColor: "white" },
      { name: "Santorini White", hex: "#F7F4EC", colSpan: "col-span-2", textColor: "black" },
    ],
  },
  {
    name: "Matcha Ceremony",
    colors: [
      { name: "Matcha Lime", hex: "#A9C632", colSpan: "col-span-3", textColor: "black" },
      { name: "Forest Brew", hex: "#1D2E1B", colSpan: "row-span-2", textColor: "white" },
      { name: "Tea Mist", hex: "#C8D2A6", colSpan: "col-span-2", textColor: "black" },
      { name: "Bamboo Beige", hex: "#E6D4A6", colSpan: "col-span-2", textColor: "black" },
    ],
  },
  {
    name: "Cotton Candy Sky",
    colors: [
      { name: "Bubblegum Pink", hex: "#E7B9C8", colSpan: "col-span-3", textColor: "black" },
      { name: "Berry Jam", hex: "#B8365A", colSpan: "row-span-2", textColor: "white" },
      { name: "Skyline Blue", hex: "#A8CBE5", colSpan: "col-span-2", textColor: "black" },
      { name: "Cream Oat", hex: "#EAD9BF", colSpan: "col-span-2", textColor: "black" },
    ],
  },
];
