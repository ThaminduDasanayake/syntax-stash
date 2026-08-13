export const CATEGORIES = {
  ai: "AI & Machine Learning",
  colors: "Color & Gradients",
  data: "Data & APIs",
  design: "Design & UX",
  dev: "Developer Tools & Utilities",
  education: "Education & Community",
  frontend: "Frontend & UI",
  icons: "Icons & Illustrations",
  inspiration: "Inspiration & Galleries",
  media: "Media & Assets",
  typography: "Typography",
  ui: "UI Components & Libraries",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
