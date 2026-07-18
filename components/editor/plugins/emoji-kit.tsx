"use client";

import emojiMartData from "@emoji-mart/data";
import { EmojiInputPlugin, EmojiPlugin } from "@platejs/emoji/react";

import { EmojiInputElement } from "@/components/plate-ui/emoji-node";

export const EmojiKit = [
  EmojiInputPlugin.withComponent(EmojiInputElement),
  EmojiPlugin.configure({
    options: { data: emojiMartData as any },
  }),
];
