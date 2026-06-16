"use client";

import { Image, ImagePlugin, useMediaState } from "@platejs/media/react";
import type { TImageElement } from "platejs";
import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { MediaToolbar } from "./media-toolbar";

export function ImageElement(props: PlateElementProps<TImageElement>) {
  const { focused, selected } = useMediaState();

  return (
    <MediaToolbar plugin={ImagePlugin}>
      <PlateElement {...props} className="py-2.5">
        <figure className="group relative m-0" contentEditable={false}>
          <div>
            <Image
              className={cn(
                "block w-full max-w-full cursor-pointer object-cover px-0",
                "rounded-none",
                focused && selected && "ring-ring ring-2 ring-offset-2",
              )}
              alt={(props.attributes?.alt as string) || "Image"}
            />
          </div>
        </figure>

        {props.children}
      </PlateElement>
    </MediaToolbar>
  );
}
