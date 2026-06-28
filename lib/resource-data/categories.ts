export const CATEGORIES = {
  ai: "AI & Machine Learning",
  data: "Data & APIs",
  design: "Design & UX",
  dev: "Developer Tools & Utilities",
  education: "Education & Community",
  frontend: "Frontend & UI",
  media: "Media & Assets",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
