export const LANGUAGES = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "python",
  "go",
  "rust",
  "java",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "bash",
  "html",
  "css",
  "scss",
  "json",
  "yaml",
  "toml",
  "sql",
  "markdown",
  "dockerfile",
  "graphql",
];

export const THEMES = [
  { id: "github-dark", label: "GitHub Dark" },
  { id: "github-light", label: "GitHub Light" },
  { id: "dracula", label: "Dracula" },
  { id: "nord", label: "Nord" },
  { id: "one-dark-pro", label: "One Dark Pro" },
  { id: "min-dark", label: "Min Dark" },
  { id: "monokai", label: "Monokai" },
  { id: "vitesse-dark", label: "Vitesse Dark" },
  { id: "vitesse-light", label: "Vitesse Light" },
];

export const BACKGROUNDS = [
  {
    id: "sunset",
    label: "Sunset",
    value: "linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #ec4899 100%)",
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)",
  },
  {
    id: "forest",
    label: "Forest",
    value: "linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #06b6d4 100%)",
  },
  {
    id: "candy",
    label: "Candy",
    value: "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #3b82f6 100%)",
  },
  { id: "mono", label: "Mono Dark", value: "#1f2937" },
  { id: "charcoal", label: "Charcoal", value: "#0f172a" },
  { id: "white", label: "White", value: "#ffffff" },
  { id: "transparent", label: "Transparent", value: "transparent" },
];

export const PLACEHOLDER_CODE = `function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const log = debounce((msg: string) => {
  console.log("tick:", msg);
}, 300);`;
