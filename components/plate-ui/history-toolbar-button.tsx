"use client";

import { ArrowUUpLeftIcon, ArrowUUpRightIcon } from "@phosphor-icons/react";
import { useEditorRef, useEditorSelector } from "platejs/react";
import * as React from "react";

import { ToolbarButton } from "./toolbar";

export function RedoToolbarButton(props: React.ComponentProps<typeof ToolbarButton>) {
  const editor = useEditorRef();
  const disabled = useEditorSelector((editor) => editor.history.redos.length === 0, []);

  return (
    <ToolbarButton
      {...props}
      disabled={disabled}
      onClick={() => editor.redo()}
      onMouseDown={(e) => e.preventDefault()}
      tooltip="Redo"
    >
      <ArrowUUpRightIcon />
    </ToolbarButton>
  );
}

export function UndoToolbarButton(props: React.ComponentProps<typeof ToolbarButton>) {
  const editor = useEditorRef();
  const disabled = useEditorSelector((editor) => editor.history.undos.length === 0, []);

  return (
    <ToolbarButton
      {...props}
      disabled={disabled}
      onClick={() => editor.undo()}
      onMouseDown={(e) => e.preventDefault()}
      tooltip="Undo"
    >
      <ArrowUUpLeftIcon />
    </ToolbarButton>
  );
}
