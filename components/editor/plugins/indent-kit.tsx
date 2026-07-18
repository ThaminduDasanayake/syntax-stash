"use client";

import { IndentPlugin } from "@platejs/indent/react";
import { KEYS } from "platejs";

export const IndentKit = [
  IndentPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.img,
        KEYS.p,
        KEYS.toggle,
      ],
    },
    options: {
      offset: 24,
    },
  }),
];
