import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
} from "@platejs/basic-nodes";

import { CodeLeafStatic } from "@/components/plate-ui/code-node-static";

export const BaseBasicMarksKit = [
  BaseBoldPlugin,
  BaseCodePlugin.withComponent(CodeLeafStatic),
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
];
