"use client";

import { BulletedListRules, OrderedListRules, TaskListRules } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import { KEYS } from "platejs";

import { IndentKit } from "@/components/editor/plugins/indent-kit";
import { BlockList } from "@/components/plate-ui/block-list";

export const ListKit = [
  ...IndentKit,
  ListPlugin.configure({
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
    inputRules: [
      BulletedListRules.markdown({ variant: "*" }),
      BulletedListRules.markdown({ variant: "-" }),
      OrderedListRules.markdown({ variant: ")" }),
      OrderedListRules.markdown({ variant: "." }),
      TaskListRules.markdown({ checked: false }),
      TaskListRules.markdown({ checked: true }),
    ],
    render: {
      belowNodes: BlockList,
    },
  }),
];
