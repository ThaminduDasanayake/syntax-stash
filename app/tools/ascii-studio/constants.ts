import { FigletFont } from "./types";

export const FIGLET_FONTS: { id: FigletFont; label: string }[] = [
  { id: "Standard", label: "Standard" },
  { id: "Slant", label: "Slant" },
  { id: "Block", label: "Block" },
  { id: "Money", label: "Money" },
];

export const ASCII_RAMP = "@%#*+=-:. ";

export const SAMPLE_TREE = `src/
  components/
    Button.tsx
    Card.tsx
  hooks/
    useAuth.ts
    useFetch.ts
  utils.ts
  index.ts`;

export const SAMPLE_BANNER = "Hello";
