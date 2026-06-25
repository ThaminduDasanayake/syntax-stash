export const CATEGORIES = {
  ai: "AI & Machine Learning",
  animations: "Animations & Effects",
  backend: "Backend & CMS",
  colors: "Colors & Gradients",
  data: "Data",
  dataViz: "Data Visualization",
  design: "Design & Creative",
  devTools: "Developer Tools & Utilities",
  development: "Development & Code",
  education: "Education",
  icons: "Icons & Logos",
  imagesAssets: "Images & Assets",
  jobs: "Jobs & Careers",
  maps: "Map Resources",
  react: "React Resources",
  typography: "Typography & Fonts",
  uiComponents: "UI Components",
  unknown: "Unknown",
} as const;

export type CategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const resourceCategories: CategoryValue[] = Object.values(CATEGORIES);
