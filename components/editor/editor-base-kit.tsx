import { BaseBasicBlocksKit } from "./plugins/basic-blocks-base-kit";
import { BaseBasicMarksKit } from "./plugins/basic-marks-base-kit";
import { BaseCodeBlockKit } from "./plugins/code-block-base-kit";
import { BaseFootnoteKit } from "./plugins/footnote-base-kit";
import { BaseLinkKit } from "./plugins/link-base-kit";
import { BaseListKit } from "./plugins/list-base-kit";
import { MarkdownKit } from "./plugins/markdown-kit";
import { BaseMathKit } from "./plugins/math-base-kit";
import { BaseMediaKit } from "./plugins/media-base-kit";
import { BaseTableKit } from "./plugins/table-base-kit";

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseTableKit,
  ...BaseMediaKit,
  ...BaseMathKit,
  ...BaseLinkKit,
  ...BaseBasicMarksKit,
  ...BaseListKit,
  ...MarkdownKit,
  ...BaseFootnoteKit,
];
