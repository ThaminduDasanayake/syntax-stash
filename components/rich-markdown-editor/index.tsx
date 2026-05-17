"use client";

import {
  CodeIcon,
  QuotesIcon,
  TextBIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from "@phosphor-icons/react";
import { insertFootnote } from "@platejs/footnote";
import { deserializeMd, serializeMd } from "@platejs/markdown";
import { KEYS } from "platejs";
import { Plate, useEditorRef, useEditorSelector, usePlateEditor } from "platejs/react";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { BasicNodesKit } from "@/components/editor/plugins/basic-nodes-kit";
import { CodeBlockKit } from "@/components/editor/plugins/code-block-kit";
import { EmojiKit } from "@/components/editor/plugins/emoji-kit";
import { BaseFootnoteKit } from "@/components/editor/plugins/footnote-base-kit";
import { LinkKit } from "@/components/editor/plugins/link-kit";
import { ListKit } from "@/components/editor/plugins/list-kit";
import { MarkdownKit } from "@/components/editor/plugins/markdown-kit";
import { MathKit } from "@/components/editor/plugins/math-kit";
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { TableKit } from "@/components/editor/plugins/table-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { EmojiToolbarButton } from "@/components/ui/emoji-toolbar-button";
import { InlineEquationToolbarButton } from "@/components/ui/equation-toolbar-button";
import { LinkToolbarButton } from "@/components/ui/link-toolbar-button";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from "@/components/ui/list-toolbar-button";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { TableToolbarButton } from "@/components/ui/table-toolbar-button";
import { Toolbar, ToolbarButton, ToolbarGroup } from "@/components/ui/toolbar";

const plugins = [
  ...BasicNodesKit,
  ...MarkdownKit,
  ...ListKit,
  ...LinkKit,
  ...TableKit,
  ...CodeBlockKit,
  ...MathKit,
  ...BaseFootnoteKit,
  ...EmojiKit,
  ...SlashKit,
];

interface RichMarkdownEditorProps {
  initialMarkdown?: string;
  onChange?: (markdown: string) => void;
}

export default function RichMarkdownEditor({ initialMarkdown, onChange }: RichMarkdownEditorProps) {
  const editor = usePlateEditor({
    plugins,
    value: initialMarkdown ? (e) => deserializeMd(e, initialMarkdown) : undefined,
  });

  const lastMd = useRef(initialMarkdown);
  const debouncedOnChange = useDebounceCallback((md: string) => onChange?.(md), 500);

  useEffect(() => {
    if (initialMarkdown === lastMd.current) return;
    lastMd.current = initialMarkdown;
    if (initialMarkdown === undefined) return;
    editor.tf.setValue(deserializeMd(editor, initialMarkdown));
  }, [editor, initialMarkdown]);

  return (
    <div className="border-input bg-background w-full rounded-lg border">
      <Plate editor={editor} onValueChange={({ editor: e }) => debouncedOnChange(serializeMd(e))}>
        <EditorToolbar />
        <EditorContainer>
          <Editor
            variant="none"
            className="min-h-100 w-full px-4 py-3 text-base"
            placeholder="Start typing…"
          />
        </EditorContainer>
      </Plate>
    </div>
  );
}

function EditorToolbar() {
  return (
    <Toolbar className="border-border flex-wrap border-b px-2 py-1">
      <ToolbarGroup>
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘B)">
          <TextBIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘I)">
          <TextItalicIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough (⌘⇧X)">
          <TextStrikethroughIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="code" tooltip="Inline code (⌘E)">
          <CodeIcon />
        </MarkToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <BlockToolbarButton blockType="h1" tooltip="Heading 1 (⌘⌥1)">
          <TextHOneIcon />
        </BlockToolbarButton>
        <BlockToolbarButton blockType="h2" tooltip="Heading 2 (⌘⌥2)">
          <TextHTwoIcon />
        </BlockToolbarButton>
        <BlockToolbarButton blockType="h3" tooltip="Heading 3 (⌘⌥3)">
          <TextHThreeIcon />
        </BlockToolbarButton>
        <BlockToolbarButton blockType="blockquote" tooltip="Blockquote (⌘⇧.)">
          <QuotesIcon />
        </BlockToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <BulletedListToolbarButton />
        <NumberedListToolbarButton />
        <TodoListToolbarButton />
      </ToolbarGroup>
      <ToolbarGroup>
        <LinkToolbarButton />
        <TableToolbarButton />
        <CodeBlockToolbarButton />
      </ToolbarGroup>
      <ToolbarGroup>
        <InlineEquationToolbarButton />
        <FootnoteToolbarButton />
        <EmojiToolbarButton />
      </ToolbarGroup>
    </Toolbar>
  );
}

function BlockToolbarButton({
  blockType,
  children,
  tooltip,
}: {
  blockType: string;
  children: React.ReactNode;
  tooltip: string;
}) {
  const editor = useEditorRef();
  const isActive = useEditorSelector(
    (e) => !!e.api.above({ match: { type: blockType }, at: e.selection ?? undefined }),
    [blockType],
  );

  return (
    <ToolbarButton
      pressed={isActive}
      tooltip={tooltip}
      onClick={() => (editor.tf as Record<string, { toggle?: () => void }>)[blockType]?.toggle?.()}
    >
      {children}
    </ToolbarButton>
  );
}

function CodeBlockToolbarButton() {
  const editor = useEditorRef();
  const isActive = useEditorSelector((e) => !!e.api.some({ match: { type: KEYS.codeBlock } }), []);

  return (
    <ToolbarButton
      pressed={isActive}
      tooltip="Code block (⌘⌥8)"
      onClick={() =>
        (editor.tf as Record<string, { toggle?: () => void }>)[KEYS.codeBlock]?.toggle?.()
      }
    >
      <CodeIcon className="size-4" />
    </ToolbarButton>
  );
}

function FootnoteToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton tooltip="Footnote" onClick={() => insertFootnote(editor)}>
      <span className="font-mono text-[11px] leading-none">fn</span>
    </ToolbarButton>
  );
}
