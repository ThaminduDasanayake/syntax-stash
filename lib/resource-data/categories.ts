export const CATEGORIES = {
  ai: "AI & Machine Learning",
  colors: "Color & Gradients",
  data: "Data & APIs",
  design: "Design & UX",
  dev: "Developer Tools & Utilities",
  education: "Education & Community",
  frontend: "Frontend & UI",
  media: "Media & Assets",
  typography: "Typography",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
