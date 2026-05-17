"use client";

import { TrailingBlockPlugin, type Value } from "platejs";
import { type TPlateEditor, useEditorRef } from "platejs/react";

import { AutoformatKit } from "@/components/editor/plugins/autoformat-kit";
import { BasicBlocksKit } from "@/components/editor/plugins/basic-blocks-kit";
import { BasicMarksKit } from "@/components/editor/plugins/basic-marks-kit";
import { BlockMenuKit } from "@/components/editor/plugins/block-menu-kit";
import { BlockPlaceholderKit } from "@/components/editor/plugins/block-placeholder-kit";
import { CodeBlockKit } from "@/components/editor/plugins/code-block-kit";
import { CursorOverlayKit } from "@/components/editor/plugins/cursor-overlay-kit";
import { EmojiKit } from "@/components/editor/plugins/emoji-kit";
import { ExitBreakKit } from "@/components/editor/plugins/exit-break-kit";
import { FixedToolbarKit } from "@/components/editor/plugins/fixed-toolbar-kit";
import { FloatingToolbarKit } from "@/components/editor/plugins/floating-toolbar-kit";
import { FootnoteKit } from "@/components/editor/plugins/footnote-kit";
import { LinkKit } from "@/components/editor/plugins/link-kit";
import { ListKit } from "@/components/editor/plugins/list-kit";
import { MarkdownKit } from "@/components/editor/plugins/markdown-kit";
import { MathKit } from "@/components/editor/plugins/math-kit";
import { MediaKit } from "@/components/editor/plugins/media-kit";
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { TableKit } from "@/components/editor/plugins/table-kit";

export const EditorKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...MediaKit,
  ...MathKit,
  ...LinkKit,
  ...FootnoteKit,

  // Marks
  ...BasicMarksKit,

  // Block Style
  ...ListKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
