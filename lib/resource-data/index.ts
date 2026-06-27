import { Tool } from "@/types";

import { aiLinks } from "./ai-resources";
import { colorLinks } from "./color-resources";
import { dataLinks } from "./data-resources";
import { designLinks } from "./design-resources";
import { developmentLinks } from "./development-resources";
import { educationLinks } from "./education-resources";
import { frontendLinks } from "./frontend-resources";
import { mediaLinks } from "./media-resources";

export { aiLinks } from "./ai-resources";
export { type CategoryValue, resourceCategories } from "./categories";
export { colorLinks } from "./color-resources";
export { dataLinks } from "./data-resources";
export { designLinks } from "./design-resources";
export { developmentLinks } from "./development-resources";
export { educationLinks } from "./education-resources";
export { frontendLinks } from "./frontend-resources";
export { mediaLinks } from "./media-resources";

export const resourceLinks: Tool[] = [
  ...aiLinks,
  ...frontendLinks,
  ...colorLinks,
  ...dataLinks,
  ...designLinks,
  ...developmentLinks,
  ...educationLinks,
  ...mediaLinks,
];
