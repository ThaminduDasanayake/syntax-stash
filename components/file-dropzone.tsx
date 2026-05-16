"use client";

import { UploadIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";
import { Accept, useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileDropAction?: (file: File) => void;
  onFilesDropAction?: (files: File[]) => void;
  accept?: Accept;
  label: string | ReactNode;
  multiple?: boolean;
  maxSize?: number;
  onReject?: (errorMessage: string) => void;
}

export default function FileDropzone({
  onFileDropAction,
  onFilesDropAction,
  accept,
  label,
  multiple = false,
  maxSize,
  onReject,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxSize,
    maxFiles: multiple ? 0 : 1,

    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      if (multiple && onFilesDropAction) {
        onFilesDropAction(acceptedFiles);
      } else if (!multiple && onFileDropAction) {
        onFileDropAction(acceptedFiles[0]);
      }
    },

    onDropRejected: (fileRejections) => {
      if (!onReject) return;

      const rejection = fileRejections[0];
      const error = rejection.errors[0];

      if (error.code === "file-too-large") {
        const sizeMb = (maxSize! / (1024 * 1024)).toFixed(1);
        onReject(`File is too large. Maximum size is ${sizeMb} MB.`);
      } else if (error.code === "file-invalid-type") {
        onReject("Invalid file type. Please check the allowed formats.");
      } else {
        onReject(error.message);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/10 hover:bg-muted/30 hover:border-muted-foreground",
      )}
    >
      <input {...getInputProps()} />
      <UploadIcon size={40} className="text-muted-foreground mb-4" />
      <div className="text-center">{label}</div>
    </div>
  );
}
