"use client";

import {
  CaretRightIcon,
  CheckIcon,
  CodeIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  ParagraphIcon,
  QuotesIcon,
  SquareIcon,
  TextHFiveIcon,
  TextHFourIcon,
  TextHOneIcon,
  TextHSixIcon,
  TextHThreeIcon,
  TextHTwoIcon,
} from "@phosphor-icons/react";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItemIndicator } from "@radix-ui/react-dropdown-menu";
import type { TElement } from "platejs";
import { KEYS } from "platejs";
import { useEditorRef, useSelectionFragmentProp } from "platejs/react";
import * as React from "react";

import { getBlockType, setBlockType } from "@/components/editor/transforms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ToolbarButton, ToolbarMenuGroup } from "./toolbar";

export const turnIntoItems = [
  {
    icon: <CaretRightIcon />,
    keywords: ["collapsible", "expandable"],
    label: "Toggle list",
    value: KEYS.toggle,
  },
  {
    icon: <CodeIcon />,
    keywords: ["```"],
    label: "Code",
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
  // {
  //   icon: <Code2 />,
  //   keywords: ["code-drawing", "diagram", "plantuml", "graphviz", "flowchart", "mermaid"],
  //   label: "Code Drawing",
  //   value: KEYS.codeDrawing,
  // },
  {
    icon: <QuotesIcon />,
    keywords: [">", "blockquote", "citation"],
    label: "Quote",
    value: KEYS.blockquote,
  },
  {
    icon: <SquareIcon />,
    keywords: ["[]", "checkbox", "checklist", "task"],
    label: "To-do list",
    value: KEYS.listTodo,
  },
  {
    icon: <TextHFiveIcon />,
    keywords: ["h5", "subtitle"],
    label: "Heading 5",
    value: "h5",
  },
  {
    icon: <TextHFourIcon />,
    keywords: ["h4", "subtitle"],
    label: "Heading 4",
    value: "h4",
  },
  {
    icon: <TextHOneIcon />,
    keywords: ["h1", "title"],
    label: "Heading 1",
    value: "h1",
  },
  {
    icon: <TextHSixIcon />,
    keywords: ["h6", "subtitle"],
    label: "Heading 6",
    value: "h6",
  },
  {
    icon: <TextHThreeIcon />,
    keywords: ["h3", "subtitle"],
    label: "Heading 3",
    value: "h3",
  },
  {
    icon: <TextHTwoIcon />,
    keywords: ["h2", "subtitle"],
    label: "Heading 2",
    value: "h2",
  },
  // {
  //   icon: <Columns3Icon />,
  //   label: "3 columns",
  //   value: "action_three_columns",
  // },
];

export function TurnIntoToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const value = useSelectionFragmentProp({
    defaultValue: KEYS.p,
    getProp: (node) => getBlockType(node as TElement),
  });
  const selectedItem = React.useMemo(
    () => turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ?? turnIntoItems[0],
    [value],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton className="min-w-[125px]" pressed={open} tooltip="Turn into" isDropdown>
          {selectedItem.label}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar min-w-0"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.tf.focus();
        }}
        align="start"
      >
        <ToolbarMenuGroup
          value={value}
          onValueChange={(type) => {
            setBlockType(editor, type);
          }}
          label="Turn into"
        >
          {turnIntoItems.map(({ icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              className="min-w-[180px] pl-2 *:first:[span]:hidden"
              value={itemValue}
            >
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                <DropdownMenuItemIndicator>
                  <CheckIcon />
                </DropdownMenuItemIndicator>
              </span>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </ToolbarMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
