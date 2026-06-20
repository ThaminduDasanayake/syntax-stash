import { Tool } from "@/types";

export { aiLinks } from "./ai-resources";
export { animationLinks } from "./animation-resources";
export { backendLinks } from "./backend-resources";
export { type CategoryValue, resourceCategories } from "./categories";
export { colorLinks } from "./color-resources";
export { dataLinks } from "./data-resources";
export { dataVizLinks } from "./data-viz-resources";
export { designLinks } from "./design-resources";
export { developmentLinks } from "./development-resources";
export { educationLinks } from "./education-resources";
export { iconLinks } from "./icon-resources";
export { imageAssetLinks } from "./image-asset-resources";
export { jobLinks } from "./job-resources";
export { mapLinks } from "./map-resources";
export { reactLinks } from "./react-resources";
export { toolLinks } from "./tools-resources";
export { typographyLinks } from "./typography-resources";
export { uiComponentLinks } from "./ui-component-resources";

import { aiLinks } from "./ai-resources";
import { animationLinks } from "./animation-resources";
import { backendLinks } from "./backend-resources";
import { colorLinks } from "./color-resources";
import { dataLinks } from "./data-resources";
import { dataVizLinks } from "./data-viz-resources";
import { designLinks } from "./design-resources";
import { developmentLinks } from "./development-resources";
import { educationLinks } from "./education-resources";
import { iconLinks } from "./icon-resources";
import { imageAssetLinks } from "./image-asset-resources";
import { jobLinks } from "./job-resources";
import { mapLinks } from "./map-resources";
import { reactLinks } from "./react-resources";
import { toolLinks } from "./tools-resources";
import { typographyLinks } from "./typography-resources";
import { uiComponentLinks } from "./ui-component-resources";

export const resourceLinks: Tool[] = [
  ...aiLinks,
  ...animationLinks,
  ...backendLinks,
  ...colorLinks,
  ...dataLinks,
  ...dataVizLinks,
  ...designLinks,
  ...developmentLinks,
  ...educationLinks,
  ...iconLinks,
  ...imageAssetLinks,
  ...jobLinks,
  ...mapLinks,
  ...reactLinks,
  ...toolLinks,
  ...typographyLinks,
  ...uiComponentLinks,
];
