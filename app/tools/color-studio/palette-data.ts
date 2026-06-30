export type Colors = {
  name: string;
  hex: string;
  colSpan?: string;
  textColor?: "white" | "black";
};

type Palette = {
  name: string;
  colors: Colors[];
};

/* eslint-disable perfectionist/sort-objects, perfectionist/sort-arrays */

export const COLOR_PALETTES: Palette[] = [
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
    name: "Fresh Color 1",
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
    name: "Fresh Color 2",
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
    name: "Fresh Color 3",
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
    name: "Fresh Color 4",
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
    name: "Fresh Color 5",
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
];
