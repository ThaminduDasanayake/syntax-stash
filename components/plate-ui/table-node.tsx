"use client";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { TablePlugin, TableProvider } from "@platejs/table/react";
import { type TTableCellElement, type TTableElement, type TTableRowElement } from "platejs";
import {
  PlateElement,
  type PlateElementProps,
  useEditorPlugin,
  useEditorSelector,
  useElement,
  useFocusedLast,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
  withHOC,
} from "platejs/react";
import * as React from "react";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Toolbar, ToolbarButton, ToolbarGroup } from "./toolbar";

export const TableElement = withHOC(
  TableProvider,
  function TableElement({ children, ...props }: PlateElementProps<TTableElement>) {
    const readOnly = useReadOnly();

    const content = (
      <PlateElement {...props} className="overflow-x-auto py-5">
        <div className="group/table relative w-full">
          <table className="border-border min-w-full table-auto border-collapse border">
            <tbody className="min-w-full">{children}</tbody>
          </table>
        </div>
      </PlateElement>
    );

    if (readOnly) {
      return content;
    }

    return <TableFloatingToolbar>{content}</TableFloatingToolbar>;
  },
);

function TableFloatingToolbar({ children, ...props }: React.ComponentProps<typeof PopoverContent>) {
  const selected = useSelected();
  const collapsedInside = useEditorSelector(
    (editor) => selected && editor.api.isCollapsed(),
    [selected],
  );
  const isFocusedLast = useFocusedLast();

  const isToolbarOpen = isFocusedLast && collapsedInside;

  return (
    <Popover open={isToolbarOpen} modal={false}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      {isToolbarOpen && <CollapsedTableFloatingToolbarContent {...props} />}
    </Popover>
  );
}

function CollapsedTableFloatingToolbarContent(props: React.ComponentProps<typeof PopoverContent>) {
  const { tf } = useEditorPlugin(TablePlugin);
  const element = useElement<TTableElement>();
  const { props: buttonProps } = useRemoveNodeButton({ element });

  return (
    <PopoverContent
      asChild
      onOpenAutoFocus={(e) => e.preventDefault()}
      contentEditable={false}
      {...props}
    >
      <Toolbar
        className="scrollbar-hide bg-popover flex w-auto flex-row overflow-x-auto rounded-md border p-1 shadow-md print:hidden"
        contentEditable={false}
      >
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => tf.insert.tableRow({ before: true })}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Insert row before"
          >
            <ArrowUpIcon weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => tf.insert.tableRow()}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Insert row after"
          >
            <ArrowDownIcon weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => tf.remove.tableRow()}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Delete row"
          >
            <XIcon weight="bold" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => tf.insert.tableColumn({ before: true })}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Insert column before"
          >
            <ArrowLeftIcon weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => tf.insert.tableColumn()}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Insert column after"
          >
            <ArrowRightIcon weight="bold" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => tf.remove.tableColumn()}
            onMouseDown={(e) => e.preventDefault()}
            tooltip="Delete column"
          >
            <XIcon weight="bold" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton tooltip="Delete table" {...buttonProps}>
            <TrashIcon weight="bold" className="text-destructive" />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </PopoverContent>
  );
}

export function TableRowElement({ children, ...props }: PlateElementProps<TTableRowElement>) {
  return (
    <PlateElement {...props} as="tr" className="group/row">
      {children}
    </PlateElement>
  );
}

export function TableCellElement({
  isHeader,
  ...props
}: PlateElementProps<TTableCellElement> & {
  isHeader?: boolean;
}) {
  return (
    <PlateElement
      {...props}
      as={isHeader ? "th" : "td"}
      className={cn(
        "border-border relative border p-2 text-left",
        isHeader && "bg-muted font-semibold",
      )}
    >
      <div className="relative z-20 box-border h-full px-1 py-1">{props.children}</div>
    </PlateElement>
  );
}

export function TableCellHeaderElement(props: React.ComponentProps<typeof TableCellElement>) {
  return <TableCellElement {...props} isHeader />;
}
