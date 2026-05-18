import type { TTableCellElement, TTableElement } from "platejs";
import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";
import * as React from "react";

import { cn } from "@/lib/utils";

export function TableElementStatic({ children, ...props }: SlateElementProps<TTableElement>) {
  return (
    <SlateElement {...props} className="overflow-x-auto py-5">
      <div className="group/table relative w-full">
        <table className="border-border min-w-full table-auto border-collapse border">
          <tbody className="min-w-full">{children}</tbody>
        </table>
      </div>
    </SlateElement>
  );
}

export function TableRowElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props} as="tr" className="group/row">
      {props.children}
    </SlateElement>
  );
}

export function TableCellElementStatic({
  isHeader,
  ...props
}: SlateElementProps<TTableCellElement> & {
  isHeader?: boolean;
}) {
  return (
    <SlateElement
      {...props}
      as={isHeader ? "th" : "td"}
      className={cn(
        "border-border relative border p-2 text-left",
        isHeader && "bg-muted font-semibold",
      )}
    >
      <div className="relative z-20 box-border h-full px-1 py-1">{props.children}</div>
    </SlateElement>
  );
}

export function TableCellHeaderElementStatic(props: SlateElementProps<TTableCellElement>) {
  return <TableCellElementStatic {...props} isHeader />;
}
