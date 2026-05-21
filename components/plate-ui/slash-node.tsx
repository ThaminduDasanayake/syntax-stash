"use client";

import {
  CodeIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  ParagraphIcon,
  QuotesIcon,
  RadicalIcon,
  SquareIcon,
  TableIcon,
  TextHFiveIcon,
  TextHFourIcon,
  TextHOneIcon,
  TextHSixIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextSuperscriptIcon,
} from "@phosphor-icons/react";
import { KEYS, type TComboboxInputElement } from "platejs";
import type { PlateEditor, PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";
import * as React from "react";

import { insertBlock, insertInlineElement } from "@/components/editor/transforms";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";

type Group = {
  group: string;
  items: {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
  }[];
};

const groups: Group[] = [
  {
    group: "Basic blocks",
    items: [
      {
        icon: <ParagraphIcon />,
        keywords: ["paragraph"],
        label: "Text",
        value: KEYS.p,
      },
      {
        icon: <TextHOneIcon />,
        keywords: ["title", "h1"],
        label: "Heading 1",
        value: KEYS.h1,
      },
      {
        icon: <TextHTwoIcon />,
        keywords: ["subtitle", "h2"],
        label: "Heading 2",
        value: KEYS.h2,
      },
      {
        icon: <TextHThreeIcon />,
        keywords: ["subtitle", "h3"],
        label: "Heading 3",
        value: KEYS.h3,
      },
      {
        icon: <TextHFourIcon />,
        keywords: ["subtitle", "h4"],
        label: "Heading 4",
        value: KEYS.h4,
      },
      {
        icon: <TextHFiveIcon />,
        keywords: ["subtitle", "h5"],
        label: "Heading 5",
        value: KEYS.h5,
      },
      {
        icon: <TextHSixIcon />,
        keywords: ["subtitle", "h6"],
        label: "Heading 6",
        value: KEYS.h6,
      },
      {
        icon: <ListBulletsIcon />,
        keywords: ["unordered", "ul", "-"],
        label: "Bulleted list",
        value: KEYS.ul,
      },
      {
        icon: <ListNumbersIcon />,
        keywords: ["ordered", "ol", "1"],
        label: "Numbered list",
        value: KEYS.ol,
      },
      {
        icon: <SquareIcon />,
        keywords: ["checklist", "task", "checkbox", "[]"],
        label: "To-do list",
        value: KEYS.listTodo,
      },
      {
        icon: <CodeIcon />,
        keywords: ["```"],
        label: "Code Block",
        value: KEYS.codeBlock,
      },
      {
        icon: <TableIcon />,
        label: "Table",
        value: KEYS.table,
      },
      {
        icon: <QuotesIcon />,
        keywords: ["citation", "blockquote", "quote", ">"],
        label: "Blockquote",
        value: KEYS.blockquote,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value, { upsert: true });
      },
    })),
  },
  {
    group: "Advanced",
    items: [
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: "Equation",
        value: KEYS.equation,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value, { upsert: true });
      },
    })),
  },
  {
    group: "Inline",
    items: [
      {
        focusEditor: true,
        icon: <TextSuperscriptIcon />,
        keywords: ["citation", "fn", "footnote", "[^]"],
        label: "Footnote",
        value: "action_footnote",
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: "Inline Equation",
        value: KEYS.inlineEquation,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export function SlashInputElement(props: PlateElementProps<TComboboxInputElement>) {
  const { editor, element } = props;

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox element={element} trigger="/">
        <InlineComboboxInput />

        <InlineComboboxContent>
          <InlineComboboxEmpty>No results</InlineComboboxEmpty>

          {groups.map(({ group, items }) => (
            <InlineComboboxGroup key={group}>
              <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

              {items.map(({ focusEditor, icon, keywords, label, value, onSelect }) => (
                <InlineComboboxItem
                  key={value}
                  value={value}
                  onClick={() => onSelect(editor, value)}
                  label={label}
                  focusEditor={focusEditor}
                  group={group}
                  keywords={keywords}
                >
                  <div className="text-muted-foreground mr-2">{icon}</div>
                  {label ?? value}
                </InlineComboboxItem>
              ))}
            </InlineComboboxGroup>
          ))}
        </InlineComboboxContent>
      </InlineCombobox>

      {props.children}
    </PlateElement>
  );
}
