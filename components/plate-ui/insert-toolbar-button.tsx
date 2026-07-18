"use client";

import {
  CodeIcon,
  ImageIcon,
  LinkIcon,
  ListBulletsIcon,
  ListChecksIcon,
  ListNumbersIcon,
  MinusIcon,
  ParagraphIcon,
  PlusIcon,
  QuotesIcon,
  RadicalIcon,
  TableIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextSuperscriptIcon,
} from "@phosphor-icons/react";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { KEYS } from "platejs";
import { type PlateEditor, useEditorRef } from "platejs/react";
import * as React from "react";

import { insertBlock, insertInlineElement } from "@/components/editor/transforms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ToolbarButton, ToolbarMenuGroup } from "./toolbar";

type Group = {
  group: string;
  items: Item[];
};

type Item = {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
};

const groups: Group[] = [
  {
    group: "Basic blocks",
    items: [
      {
        icon: <CodeIcon />,
        label: "Code",
        value: KEYS.codeBlock,
      },
      {
        icon: <MinusIcon />,
        label: "Divider",
        value: KEYS.hr,
      },
      {
        icon: <ParagraphIcon />,
        label: "Paragraph",
        value: KEYS.p,
      },
      {
        icon: <QuotesIcon />,
        label: "Quote",
        value: KEYS.blockquote,
      },
      {
        icon: <RadicalIcon />,
        label: "Equation",
        value: KEYS.equation,
      },
      {
        icon: <TableIcon />,
        label: "Table",
        value: KEYS.table,
      },
      {
        icon: <TextHOneIcon />,
        label: "Heading 1",
        value: "h1",
      },
      {
        icon: <TextHThreeIcon />,
        label: "Heading 3",
        value: "h3",
      },
      {
        icon: <TextHTwoIcon />,
        label: "Heading 2",
        value: "h2",
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: "Inline",
    items: [
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: "Inline Equation",
        value: KEYS.inlineEquation,
      },
      {
        focusEditor: true,
        icon: <TextSuperscriptIcon />,
        label: "Footnote",
        value: "action_footnote",
      },
      {
        icon: <LinkIcon />,
        label: "Link",
        value: KEYS.link,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
  {
    group: "Lists",
    items: [
      {
        icon: <ListBulletsIcon />,
        label: "Bulleted list",
        value: KEYS.ul,
      },
      {
        icon: <ListChecksIcon />,
        label: "To-do list",
        value: KEYS.listTodo,
      },
      {
        icon: <ListNumbersIcon />,
        label: "Numbered list",
        value: KEYS.ol,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: "Media",
    items: [
      {
        icon: <ImageIcon />,
        label: "Image",
        value: KEYS.img,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
];

export function InsertToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Insert" isDropdown>
          <PlusIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-125 min-w-50 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ group, items: nestedItems }) => (
          <ToolbarMenuGroup key={group} label={group}>
            {nestedItems.map(({ icon, label, onSelect, value }) => (
              <DropdownMenuItem
                key={value}
                className="gap-2"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </ToolbarMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
