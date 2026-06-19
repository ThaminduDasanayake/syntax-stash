import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const imagesAssetsLinks: Tool[] = [
  {
    title: "unDraw",
    url: "https://undraw.co/",
    description:
      "Open-source illustrations for any idea you can imagine and create. Build beautiful websites, products and applications with your color, for free.",
    category: CATEGORIES.imagesAssets,
  },
  {
    title: "Newt",
    url: "https://newt.sh/",
    className: "invert",
    description:
      "A code-native pixel art tool. Paint like a normal raster editor; underneath, every pixel is a color token in clean, editable code. Export SVG, CSS, React, PNG, and GIF.",
    category: CATEGORIES.imagesAssets,
  },
  {
    title: "fffuel",
    url: "https://www.fffuel.co/",
    description:
      "A fun collection of free SVG generators for gradients, patterns, shapes, textures & cool backgrounds. Plus, some more color tools for web designers.",
    category: CATEGORIES.unknown,
  },
];
