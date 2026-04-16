"use client";

import { UploadCloud } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { FileDropzoneProps } from "@/types";

export default function FileDropzone({ onFileDropAction, accept, label }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileDropAction(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileDropAction(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={cn(
        "cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:border-muted-foreground",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <UploadCloud
        size={40}
        className={cn(
          "mx-auto mb-4 transition-colors",
          isDragging ? "text-primary" : "text-muted-foreground",
        )}
      />
      <p className="text-foreground">{label}</p>
      <p className="text-muted-foreground mt-2 text-xs">Drag and drop or click to browse</p>
    </div>
  );
}
