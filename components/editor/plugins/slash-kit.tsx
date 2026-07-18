"use client";

import { SlashInputPlugin, SlashPlugin } from "@platejs/slash-command/react";
import { KEYS, type SlateEditor } from "platejs";

import { SlashInputElement } from "@/components/plate-ui/slash-node";

export const SlashKit = [
  SlashInputPlugin.withComponent(SlashInputElement),
  SlashPlugin.configure({
    options: {
      triggerQuery: (editor: SlateEditor) =>
        !editor.api.some({
          match: { type: editor.getType(KEYS.codeBlock) },
        }),
    },
  }),
];
