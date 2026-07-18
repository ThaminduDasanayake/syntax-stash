import { BaseFootnoteDefinitionPlugin, BaseFootnoteReferencePlugin } from "@platejs/footnote";

import {
  FootnoteDefinitionElementStatic,
  FootnoteReferenceElementStatic,
} from "@/components/plate-ui/footnote-node-static";

export const BaseFootnoteKit = [
  BaseFootnoteDefinitionPlugin.withComponent(FootnoteDefinitionElementStatic),
  BaseFootnoteReferencePlugin.withComponent(FootnoteReferenceElementStatic),
];
