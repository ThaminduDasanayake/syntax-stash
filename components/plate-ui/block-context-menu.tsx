"use client";

import {
  BLOCK_CONTEXT_MENU_ID,
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import { KEYS } from "platejs";
import { useEditorPlugin, useEditorReadOnly, usePluginOption } from "platejs/react";
import * as React from "react";

import { setBlockType } from "@/components/editor/transforms";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useIsTouchDevice } from "@/hooks/use-is-touch-device";

export function BlockContextMenu({ children }: { children: React.ReactNode }) {
  const { api, editor } = useEditorPlugin(BlockMenuPlugin);
  const isTouch = useIsTouchDevice();
  const readOnly = useEditorReadOnly();
  const openId = usePluginOption(BlockMenuPlugin, "openId");
  const isOpen = openId === BLOCK_CONTEXT_MENU_ID;

  const handleTurnInto = React.useCallback(
    (type: string) => {
      editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.getNodes()
        .forEach(([, path]) => {
          setBlockType(editor, type, { at: path });
        });
    },
    [editor],
  );

  if (isTouch) {
    return children;
  }

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          api.blockMenu.hide();
        }
      }}
      modal={false}
    >
      <ContextMenuTrigger
        asChild
        onContextMenu={(event) => {
          const dataset = (event.target as HTMLElement).dataset;
          const disabled =
            dataset?.slateEditor === "true" ||
            readOnly ||
            dataset?.plateOpenContextMenu === "false";

          if (disabled) return event.preventDefault();

          setTimeout(() => {
            api.blockMenu.show(BLOCK_CONTEXT_MENU_ID, {
              x: event.clientX,
              y: event.clientY,
            });
          }, 0);
        }}
      >
        <div className="w-full">{children}</div>
      </ContextMenuTrigger>
      {isOpen && (
        <ContextMenuContent
          className="w-64"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            editor.getApi(BlockSelectionPlugin).blockSelection.focus();
          }}
        >
          <ContextMenuGroup>
            <ContextMenuItem
              onClick={() => {
                editor.getTransforms(BlockSelectionPlugin).blockSelection.removeNodes();
                editor.tf.focus();
              }}
            >
              Delete
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                editor.getTransforms(BlockSelectionPlugin).blockSelection.duplicate();
              }}
            >
              Duplicate
              <ContextMenuShortcut>⌘ + D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Turn into</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.p)}>Paragraph</ContextMenuItem>

                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h1)}>Heading 1</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h2)}>Heading 2</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h3)}>Heading 3</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h4)}>Heading 4</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h5)}>Heading 5</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.h6)}>Heading 6</ContextMenuItem>
                <ContextMenuItem onClick={() => handleTurnInto(KEYS.blockquote)}>
                  Blockquote
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
