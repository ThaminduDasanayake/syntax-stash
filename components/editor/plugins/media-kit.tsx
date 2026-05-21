"use client";

import { ImagePlugin } from "@platejs/media/react";

import { ImageElement } from "@/components/plate-ui/media-image-node";
import { MediaPreviewDialog } from "@/components/plate-ui/media-preview-dialog";

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: {
      afterEditable: MediaPreviewDialog,
      node: ImageElement,
    },
  }),
];
