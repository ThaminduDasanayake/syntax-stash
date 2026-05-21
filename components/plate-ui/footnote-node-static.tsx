import type { TFootnoteElement } from "@platejs/footnote";
import type { SlateElementProps } from "platejs/static";
import { SlateElement } from "platejs/static";
import * as React from "react";

export function FootnoteReferenceElementStatic(props: SlateElementProps<TFootnoteElement>) {
  const { element } = props;

  return (
    <SlateElement
      {...props}
      as="sup"
      className="text-primary mx-0.5 align-super text-xs font-medium"
    >
      {props.children}[{element.identifier ?? ""}]
    </SlateElement>
  );
}

export function FootnoteDefinitionElementStatic(props: SlateElementProps<TFootnoteElement>) {
  const { element } = props;

  return (
    <SlateElement {...props} as="div" className="mt-2 flex items-start gap-2">
      <div className="text-muted-foreground mt-0.5 min-w-4 text-sm tabular-nums">
        {element.identifier ?? ""}
      </div>
      <div className="min-w-0 flex-1">{props.children}</div>
    </SlateElement>
  );
}
