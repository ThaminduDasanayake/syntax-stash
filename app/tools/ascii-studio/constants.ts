import { FigletFont } from "./types";

export const FIGLET_FONTS: { value: FigletFont; label: string }[] = [
  { value: "Standard", label: "Standard" },
  { value: "Slant", label: "Slant" },
  { value: "Block", label: "Block" },
  { value: "Money", label: "Money" },
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
