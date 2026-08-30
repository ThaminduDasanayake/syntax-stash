import { Resource } from "@/types";

import { aiLinks } from "./ai-resources";
import { animationLinks } from "./animation-resources";
import { backendLinks } from "./backend-resources";
import { colorLinks } from "./color-resources";
import { dataLinks } from "./data-resources";
import { designLinks } from "./design-resources";
import { developmentLinks } from "./development-resources";
import { documentationLinks } from "./docs-resources";
import { educationLinks } from "./education-resources";
import { frontendLinks } from "./frontend-resources";
import { iconLinks } from "./icon-resources";
import { inspirationLinks } from "./inspiration-resources";
import { mediaLinks } from "./media-resources";
import { mockupLinks } from "./mockup-resources";
import { typographyLinks } from "./typography-resources";
import { uiLinks } from "./ui-component-resources";

export { aiLinks } from "./ai-resources";
export { animationLinks } from "./animation-resources";
export { backendLinks } from "./backend-resources";
export { type CategoryValue, resourceCategories } from "./categories";
export { colorLinks } from "./color-resources";
export { dataLinks } from "./data-resources";
export { designLinks } from "./design-resources";
export { developmentLinks } from "./development-resources";
export { documentationLinks } from "./docs-resources";
export { educationLinks } from "./education-resources";
export { frontendLinks } from "./frontend-resources";
export { iconLinks } from "./icon-resources";
export { inspirationLinks } from "./inspiration-resources";
export { mediaLinks } from "./media-resources";
export { mockupLinks } from "./mockup-resources";
export { typographyLinks } from "./typography-resources";
export { uiLinks } from "./ui-component-resources";

export const resourceLinks: Resource[] = [
  ...aiLinks,
  ...animationLinks,
  ...backendLinks,
  ...colorLinks,
  ...dataLinks,
  ...designLinks,
  ...developmentLinks,
  ...documentationLinks,
  ...educationLinks,
  ...frontendLinks,
  ...iconLinks,
  ...inspirationLinks,
  ...mediaLinks,
  ...mockupLinks,
  ...typographyLinks,
  ...uiLinks,
];
