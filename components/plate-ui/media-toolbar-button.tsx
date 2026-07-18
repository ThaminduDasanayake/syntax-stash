"use client";

import { ImageIcon } from "@phosphor-icons/react";
import { isUrl, KEYS } from "platejs";
import { useEditorRef } from "platejs/react";
import * as React from "react";
import { toast } from "sonner";

import { ToolbarButton } from "@/components/plate-ui/toolbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export function MediaToolbarButton() {
  const editor = useEditorRef();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const embedMedia = React.useCallback(() => {
    if (!isUrl(url)) return toast.error("Invalid URL");

    setDialogOpen(false);

    editor.tf.insertNodes({
      children: [{ text: "" }],
      type: KEYS.img,
      url,
    });

    setUrl("");
  }, [editor, url]);

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(value) => {
        setDialogOpen(value);
        if (!value) setUrl("");
      }}
    >
      <AlertDialogTrigger asChild>
        <ToolbarButton tooltip="Insert Image">
          <ImageIcon weight="bold" className="size-4" />
        </ToolbarButton>
      </AlertDialogTrigger>

      <AlertDialogContent className="gap-6">
        <AlertDialogHeader>
          <AlertDialogTitle>Insert Image</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="group relative w-full">
          <Input
            id="url"
            className="w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                embedMedia();
              }
            }}
            placeholder="Image URL"
            type="url"
            autoFocus
          />
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              embedMedia();
            }}
          >
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
