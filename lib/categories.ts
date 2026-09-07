export const CATEGORIES = {
  ai: "AI & Machine Learning",
  animation: "Animation & Motion",
  backend: "Backend & Infrastructure",
  colors: "Color & Gradients",
  data: "Data & APIs",
  design: "Design & UX",
  dev: "Developer Tools & Utilities",
  docs: "Documentation & Markdown",
  education: "Education & Community",
  frontend: "Frontend & UI",
  icons: "Icons & Illustrations",
  inspiration: "Inspiration & Galleries",
  media: "Media & Assets",
  mockups: "Mockups & Presentations",
  typography: "Typography",
  ui: "UI Components & Libraries",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];
export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);

export interface CategoryDefinition {
  description: string;
  icon: string;
  name: string;
  order: number;
  slug: string;
  themeColor: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    description: "Color palette generators, color picker utilities, gradient creators, contrast checkers, and color systems.",
    icon: "Palette",
    name: CATEGORIES.colors,
    order: 4,
    slug: "colors",
    themeColor: "pink",
  },
  {
    description: "CSS frameworks, frontend build tools, React hooks, state management, and modern DOM helpers.",
    icon: "Code",
    name: CATEGORIES.frontend,
    order: 10,
    slug: "frontend",
    themeColor: "teal",
  },
  {
    description: "Curated AI models, machine learning APIs, LLM tools, prompts, and intelligent assistants for developers.",
    icon: "Sparkles",
    name: CATEGORIES.ai,
    order: 1,
    slug: "ai",
    themeColor: "purple",
  },
  {
    description: "Databases, serverless infrastructure, backend-as-a-service, edge runtimes, and hosting platforms.",
    icon: "Server",
    name: CATEGORIES.backend,
    order: 3,
    slug: "backend",
    themeColor: "blue",
  },
  {
    description: "Design showcases, landing page galleries, awards sites, UI animations, and web design inspiration.",
    icon: "Compass",
    name: CATEGORIES.inspiration,
    order: 12,
    slug: "inspiration",
    themeColor: "yellow",
  },
  {
    description: "Design systems, UI kits, design guidelines, prototyping platforms, accessibility tools, and UX heuristics.",
    icon: "Layout",
    name: CATEGORIES.design,
    order: 6,
    slug: "design",
    themeColor: "rose",
  },
  {
    description: "Device frame mockups, 3D presentation tools, app screenshot generators, and portfolio showcases.",
    icon: "Monitor",
    name: CATEGORIES.mockups,
    order: 14,
    slug: "mockups",
    themeColor: "violet",
  },
  {
    description: "Documentation generators, markdown editors, changelogs, knowledge base builders, and API doc tools.",
    icon: "BookOpen",
    name: CATEGORIES.docs,
    order: 8,
    slug: "docs",
    themeColor: "emerald",
  },
  {
    description: "Free stock photos, vector graphics, royalty-free audio, video background assets, and media optimizers.",
    icon: "Image",
    name: CATEGORIES.media,
    order: 13,
    slug: "media",
    themeColor: "fuchsia",
  },
  {
    description: "Free web fonts, typography scale calculators, font pair finders, variable fonts, and glyph inspectors.",
    icon: "Type",
    name: CATEGORIES.typography,
    order: 15,
    slug: "typography",
    themeColor: "stone",
  },
  {
    description: "Interactive tutorials, interactive coding platforms, web dev cheat sheets, courses, and tech communities.",
    icon: "GraduationCap",
    name: CATEGORIES.education,
    order: 9,
    slug: "education",
    themeColor: "green",
  },
  {
    description: "Pre-built component libraries, UI kits, headless primitives, accessible widgets, and web components.",
    icon: "Layers",
    name: CATEGORIES.ui,
    order: 16,
    slug: "ui",
    themeColor: "sky",
  },
  {
    description: "Productivity utilities, CLI tools, regex testers, JSON tools, linters, debuggers, and browser extensions.",
    icon: "Wrench",
    name: CATEGORIES.dev,
    order: 7,
    slug: "dev",
    themeColor: "amber",
  },
  {
    description: "Public APIs, mock data generators, GraphQL tools, web scrapers, data formatters, and datasets.",
    icon: "Database",
    name: CATEGORIES.data,
    order: 5,
    slug: "data",
    themeColor: "cyan",
  },
  {
    description: "SVG icon packs, custom icon generators, vector illustrations, 3D assets, and emoji libraries.",
    icon: "Smile",
    name: CATEGORIES.icons,
    order: 11,
    slug: "icons",
    themeColor: "orange",
  },
  {
    description: "Web animation libraries, physics engines, micro-interactions, scroll animations, and canvas visualizers.",
    icon: "Activity",
    name: CATEGORIES.animation,
    order: 2,
    slug: "animation",
    themeColor: "indigo",
  },
];

/**
 * Maps a category name or slug to its canonical category name.
 */
export function resolveCategoryName(input: string): string | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  for (const def of CATEGORY_DEFINITIONS) {
    if (def.slug.toLowerCase() === clean || def.name.toLowerCase() === clean) {
      return def.name;
    }
  }

  return null;
}

/**
 * Maps a category name or slug to its URL-friendly slug.
 */
export function resolveCategorySlug(input: string): string | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  for (const def of CATEGORY_DEFINITIONS) {
    if (def.slug.toLowerCase() === clean || def.name.toLowerCase() === clean) {
      return def.slug;
    }
  }

  return null;
}
