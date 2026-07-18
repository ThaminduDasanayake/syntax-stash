export const LANGUAGES = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "dockerfile",
  "go",
  "graphql",
  "html",
  "java",
  "javascript",
  "json",
  "jsx",
  "kotlin",
  "markdown",
  "php",
  "python",
  "ruby",
  "rust",
  "scss",
  "sql",
  "swift",
  "toml",
  "tsx",
  "typescript",
  "yaml",
];

export const THEMES = [
  { label: "Dracula", value: "dracula" },
  { label: "GitHub Dark", value: "github-dark" },
  { label: "GitHub Light", value: "github-light" },
  { label: "Min Dark", value: "min-dark" },
  { label: "Monokai", value: "monokai" },
  { label: "Nord", value: "nord" },
  { label: "One Dark Pro", value: "one-dark-pro" },
  { label: "Vitesse Dark", value: "vitesse-dark" },
  { label: "Vitesse Light", value: "vitesse-light" },
];

export const BACKGROUNDS = [
  { color: "#0f172a", label: "Charcoal", value: "charcoal" },
  { color: "#1f2937", label: "Mono Dark", value: "mono" },
  { color: "#ffffff", label: "White", value: "white" },
  {
    color: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)",
    label: "Ocean",
    value: "ocean",
  },
  {
    color: "linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #06b6d4 100%)",
    label: "Forest",
    value: "forest",
  },
  {
    color: "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #3b82f6 100%)",
    label: "Candy",
    value: "candy",
  },
  {
    color: "linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #ec4899 100%)",
    label: "Sunset",
    value: "sunset",
  },
  { color: "transparent", label: "Transparent", value: "transparent" },
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
