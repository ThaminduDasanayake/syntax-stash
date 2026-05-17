"use client";

import { ImageIcon } from "@phosphor-icons/react";
import { isUrl, KEYS } from "platejs";
import { useEditorRef } from "platejs/react";
import * as React from "react";
import { toast } from "sonner";

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
import { ToolbarButton } from "@/components/ui/toolbar";

// import {
//   ToolbarSplitButton,
//   ToolbarSplitButtonPrimary,
//   ToolbarSplitButtonSecondary,
// } from "./toolbar";
//
// const MEDIA_CONFIG: Record<
//   string,
//   {
//     accept: string[];
//     icon: React.ReactNode;
//     title: string;
//     tooltip: string;
//   }
// > = {
//   [KEYS.img]: {
//     accept: ["image/*"],
//     icon: <ImageIcon className="size-4" />,
//     title: "Insert Image",
//     tooltip: "Image",
//   },
// };

export function MediaToolbarButton() {
  //   {
  //   nodeType,
  //   ...props
  // }: DropdownMenuProps & { nodeType: string }
  // const currentConfig = MEDIA_CONFIG[nodeType];

  const editor = useEditorRef();
  // const [open, setOpen] = React.useState(false);
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
  }, [url, editor]);

  // const { openFilePicker } = useFilePicker({
  //   accept: currentConfig.accept,
  //   multiple: true,
  //   onFilesSelected: ({ plainFiles: updatedFiles }) => {
  //     editor.getTransforms(PlaceholderPlugin).insert.media(updatedFiles);
  //   },
  // });

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
