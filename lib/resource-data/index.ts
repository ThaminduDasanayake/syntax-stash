import { Tool } from "@/types";

export { animationsLinks } from "./animations";
export { type CategoryValue, resourceCategories } from "./categories";
export { colorsLinks } from "./colors";
export { dataLinks } from "./data";
export { dataVizLinks } from "./dataViz";
export { designLinks } from "./design";
export { developmentLinks } from "./development";
export { educationLinks } from "./education";
export { iconResources } from "./iconResources";
export { imagesAssetsLinks } from "./imagesAssets";
export { mapResourcesLinks } from "./mapResources";
export { reactLinks } from "./react";
export { typographyLinks } from "./typography";
export { uiComponentsLinks } from "./ui-components";

import { animationsLinks } from "./animations";
import { colorsLinks } from "./colors";
import { dataLinks } from "./data";
import { dataVizLinks } from "./dataViz";
import { designLinks } from "./design";
import { developmentLinks } from "./development";
import { educationLinks } from "./education";
import { iconResources } from "./iconResources";
import { imagesAssetsLinks } from "./imagesAssets";
import { mapResourcesLinks } from "./mapResources";
import { reactLinks } from "./react";
import { typographyLinks } from "./typography";
import { uiComponentsLinks } from "./ui-components";

export const resourceLinks: Tool[] = [
  ...animationsLinks,
  ...colorsLinks,
  ...dataLinks,
  ...dataVizLinks,
  ...designLinks,
  ...developmentLinks,
  ...educationLinks,
  ...iconResources,
  ...imagesAssetsLinks,
  ...mapResourcesLinks,
  ...reactLinks,
  ...uiComponentsLinks,
  ...typographyLinks,
];
