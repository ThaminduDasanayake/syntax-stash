import { BaseListPlugin } from "@platejs/list";
import { KEYS } from "platejs";

import { BaseIndentKit } from "@/components/editor/plugins/indent-base-kit";
import { BlockListStatic } from "@/components/plate-ui/block-list-static";

export const BaseListKit = [
  ...BaseIndentKit,
  BaseListPlugin.configure({
    inject: {
      targetPlugins: [...KEYS.heading, KEYS.blockquote, KEYS.codeBlock, KEYS.p, KEYS.toggle],
    },
    render: {
      belowNodes: BlockListStatic,
    },
  }),
];
