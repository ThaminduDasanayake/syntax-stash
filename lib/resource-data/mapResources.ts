import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const mapResourcesLinks: Tool[] = [
  {
    title: "Arnis",
    url: "https://arnismc.com/",
    description:
      "Generate Minecraft worlds from real-world locations. Free, open-source tool to recreate your hometown, city, or any place on Earth in Minecraft.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "Cityweft",
    url: "https://cityweft.com/",
    description:
      "Generate clean, editable 3D site context for any location on Earth — ready for your CAD, BIM, or generative-design workflow.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "mapcn",
    url: "https://www.mapcn.dev/",
    description:
      "A collection of beautifully designed, accessible, and customizable map components. Built on MapLibre GL. Styled with Tailwind CSS. Works with shadcn/ui.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "shadcnmaps",
    url: "https://www.shadcnmaps.com/",
    className: "invert",
    description:
      "170+ interactive SVG map components for React. Countries, continents, and US states. No dependencies — install via shadcn CLI with pure Tailwind CSS styling.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "Terraink",
    url: "https://terraink.app/",
    description:
      "Free online map poster and wallpaper generator. Design custom, print-ready map art for any city or location — export as PNG, PDF, or SVG. No sign-up required.",
    category: CATEGORIES.mapResources,
  },
  {
    title: "VisGL Google Maps",
    url: "https://visgl.github.io/react-google-maps/",
    favicon: "https://visgl.github.io/react-google-maps/images/visgl-logo-light.png",
    description: "React components and hooks for the Google Maps JavaScript API",
    category: CATEGORIES.mapResources,
  },
  {
    title: "MAKE MY DRIVE FUN",
    url: "https://makemydrivefun.com/",
    description: "Enter in two locations to make the drive fun.\n",
    category: CATEGORIES.mapResources,
  },
];
