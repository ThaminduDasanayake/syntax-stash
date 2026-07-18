import { BaseIndentPlugin } from "@platejs/indent";
import { KEYS } from "platejs";

export const BaseIndentKit = [
  BaseIndentPlugin.configure({
    inject: {
      targetPlugins: [...KEYS.heading, KEYS.blockquote, KEYS.codeBlock, KEYS.p, KEYS.toggle],
    },
    options: {
      offset: 24,
    },
  }),
];
