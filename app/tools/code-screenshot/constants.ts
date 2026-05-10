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
  { value: "github-dark", label: "GitHub Dark" },
  { value: "github-light", label: "GitHub Light" },
  { value: "dracula", label: "Dracula" },
  { value: "nord", label: "Nord" },
  { value: "one-dark-pro", label: "One Dark Pro" },
  { value: "min-dark", label: "Min Dark" },
  { value: "monokai", label: "Monokai" },
  { value: "vitesse-dark", label: "Vitesse Dark" },
  { value: "vitesse-light", label: "Vitesse Light" },
];

export const BACKGROUNDS = [
  {
    value: "sunset",
    label: "Sunset",
    color: "linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #ec4899 100%)",
  },
  {
    value: "ocean",
    label: "Ocean",
    color: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)",
  },
  {
    value: "forest",
    label: "Forest",
    color: "linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #06b6d4 100%)",
  },
  {
    value: "candy",
    label: "Candy",
    color: "linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #3b82f6 100%)",
  },
  { value: "mono", label: "Mono Dark", color: "#1f2937" },
  { value: "charcoal", label: "Charcoal", color: "#0f172a" },
  { value: "white", label: "White", color: "#ffffff" },
  { value: "transparent", label: "Transparent", color: "transparent" },
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
