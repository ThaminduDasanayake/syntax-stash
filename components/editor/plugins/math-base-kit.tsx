import { BaseEquationPlugin, BaseInlineEquationPlugin } from "@platejs/math";

import {
  EquationElementStatic,
  InlineEquationElementStatic,
} from "@/components/plate-ui/equation-node-static";

export const BaseMathKit = [
  BaseEquationPlugin.withComponent(EquationElementStatic),
  BaseInlineEquationPlugin.withComponent(InlineEquationElementStatic),
];
