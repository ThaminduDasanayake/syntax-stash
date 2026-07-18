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
    group: "Basic blocks",
    items: [
      {
        icon: <CodeIcon />,
        keywords: ["```"],
        label: "Code Block",
        value: KEYS.codeBlock,
      },
      {
        icon: <ListBulletsIcon />,
        keywords: ["-", "ul", "unordered"],
        label: "Bulleted list",
        value: KEYS.ul,
      },
      {
        icon: <ListNumbersIcon />,
        keywords: ["1", "ol", "ordered"],
        label: "Numbered list",
        value: KEYS.ol,
      },
      {
        icon: <ParagraphIcon />,
        keywords: ["paragraph"],
        label: "Text",
        value: KEYS.p,
      },
      {
        icon: <QuotesIcon />,
        keywords: [">", "blockquote", "citation", "quote"],
        label: "Blockquote",
        value: KEYS.blockquote,
      },
      {
        icon: <SquareIcon />,
        keywords: ["[]", "checkbox", "checklist", "task"],
        label: "To-do list",
        value: KEYS.listTodo,
      },
      {
        icon: <TableIcon />,
        label: "Table",
        value: KEYS.table,
      },
      {
        icon: <TextHFiveIcon />,
        keywords: ["h5", "subtitle"],
        label: "Heading 5",
        value: KEYS.h5,
      },
      {
        icon: <TextHFourIcon />,
        keywords: ["h4", "subtitle"],
        label: "Heading 4",
        value: KEYS.h4,
      },
      {
        icon: <TextHOneIcon />,
        keywords: ["h1", "title"],
        label: "Heading 1",
        value: KEYS.h1,
      },
      {
        icon: <TextHSixIcon />,
        keywords: ["h6", "subtitle"],
        label: "Heading 6",
        value: KEYS.h6,
      },
      {
        icon: <TextHThreeIcon />,
        keywords: ["h3", "subtitle"],
        label: "Heading 3",
        value: KEYS.h3,
      },
      {
        icon: <TextHTwoIcon />,
        keywords: ["h2", "subtitle"],
        label: "Heading 2",
        value: KEYS.h2,
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
        focusEditor: false,
        icon: <RadicalIcon />,
        label: "Inline Equation",
        value: KEYS.inlineEquation,
      },
      {
        focusEditor: true,
        icon: <TextSuperscriptIcon />,
        keywords: ["[^]", "citation", "fn", "footnote"],
        label: "Footnote",
        value: "action_footnote",
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

              {items.map(({ focusEditor, icon, keywords, label, onSelect, value }) => (
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
