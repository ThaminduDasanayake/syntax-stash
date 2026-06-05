export const CATEGORIES = {
  animations: "Animations & Effects",
  colors: "Colors & Gradients",
  uiComponents: "UI Components",
  data: "Data",
  dataViz: "Data Visualization",
  design: "Design & Creative",
  development: "Development & Code",
  education: "Education",
  imagesAssets: "Images & Assets",
  mapResources: "Map Resources",
  react: "React Resources",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
