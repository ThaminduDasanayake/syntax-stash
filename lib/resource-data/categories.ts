export const CATEGORIES = {
  ai: "AI & Machine Learning",
  data: "Data & Maps",
  design: "Design & UX",
  dev: "Development & Backend",
  education: "Education & Community",
  frontend: "Frontend & UI",
  media: "Media & Assets",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
