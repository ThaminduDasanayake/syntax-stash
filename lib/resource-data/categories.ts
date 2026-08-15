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

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
