import { Tool } from "@/types";

export { animationsLinks } from "./animations";
export { type CategoryValue, resourceCategories } from "./categories";
export { colorsLinks } from "./colors";
export { dataLinks } from "./data";
export { dataVizLinks } from "./dataViz";
export { designToolsLinks } from "./designTools";
export { developmentLinks } from "./development";
export { educationLinks } from "./education";
export { imagesAssetsLinks } from "./imagesAssets";
export { mapResourcesLinks } from "./mapResources";
export { reactLinks } from "./react";
export { uiComponentsLinks } from "./ui-components";

import { animationsLinks } from "./animations";
import { colorsLinks } from "./colors";
import { dataLinks } from "./data";
import { dataVizLinks } from "./dataViz";
import { designToolsLinks } from "./designTools";
import { developmentLinks } from "./development";
import { educationLinks } from "./education";
import { imagesAssetsLinks } from "./imagesAssets";
import { mapResourcesLinks } from "./mapResources";
import { reactLinks } from "./react";
import { uiComponentsLinks } from "./ui-components";

export const resourceLinks: Tool[] = [
  ...animationsLinks,
  ...colorsLinks,
  ...dataLinks,
  ...dataVizLinks,
  ...designToolsLinks,
  ...developmentLinks,
  ...educationLinks,
  ...imagesAssetsLinks,
  ...mapResourcesLinks,
  ...reactLinks,
  ...uiComponentsLinks,
];
