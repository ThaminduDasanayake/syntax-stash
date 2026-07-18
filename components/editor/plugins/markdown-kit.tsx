import { BaseFootnoteDefinitionPlugin, BaseFootnoteReferencePlugin } from "@platejs/footnote";
import { MarkdownPlugin, remarkMdx, remarkMention } from "@platejs/markdown";
import { KEYS } from "platejs";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const MarkdownKit = [
  BaseFootnoteDefinitionPlugin,
  BaseFootnoteReferencePlugin,
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.comment, KEYS.suggestion],
      remarkPlugins: [remarkEmoji as any, remarkGfm, remarkMath, remarkMdx, remarkMention],
    },
  }),
];
