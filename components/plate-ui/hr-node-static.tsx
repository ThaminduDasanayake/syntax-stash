import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";
import * as React from "react";

import { cn } from "@/lib/utils";

export function HrElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props}>
      <div className="cursor-text py-6" contentEditable={false}>
        <hr className={cn("bg-muted h-0.5 rounded-none border-none bg-clip-content")} />
      </div>
      {props.children}
    </SlateElement>
  );
}
