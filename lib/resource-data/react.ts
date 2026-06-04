import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const reactLinks: Tool[] = [
  {
    title: "React Three Fiber",
    url: "https://r3f.docs.pmnd.rs/getting-started/introduction",
    description: "React-three-fiber is a React renderer for three.js.",
    category: CATEGORIES.react,
  },
  {
    title: "UV Canvas",
    url: "https://uvcanvas.com/",
    favicon: "https://uvcanvas.com/favicon-32x32.png",
    description: "An open source React.js component library for beautifully shaded canvas.",
    category: CATEGORIES.react,
  },
  {
    title: "React Haiku",
    url: "https://www.reacthaiku.dev/",
    description: "A minimal React Hooks library that saves you time and lines of code.",
    category: CATEGORIES.react,
  },
  {
    title: "Frimousse",
    url: "https://frimousse.liveblocks.io/",
    description:
      "Open-source, lightweight, unstyled, and composable emoji picker for React—originally created for Liveblocks Comments. Styles can be applied with CSS, Tailwind CSS, CSS-in-JS, and more.",
    category: CATEGORIES.react,
  },
];
