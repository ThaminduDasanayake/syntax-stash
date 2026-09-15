"use client";

import { CloudArrowUpIcon } from "@phosphor-icons/react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CloudinaryUploadButtonProps {
  className?: string;
  disabled?: boolean;
  folder?: string;
  label?: string;
  onUploadSuccess: (url: string) => void;
  presetName?: string;
  resourceType?: "image" | "raw" | "auto";
}

export function CloudinaryUploadButton({
  className,
  disabled = false,
  folder = "syntax-stash",
  label = "Upload",
  onUploadSuccess,
  presetName,
  resourceType = "image",
}: CloudinaryUploadButtonProps) {
  const uploadPreset =
    presetName || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "syntax_stash";

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.info &&
      typeof results.info === "object" &&
      "secure_url" in results.info &&
      results.info.secure_url
    ) {
      const secureUrl = results.info.secure_url as string;
      onUploadSuccess(secureUrl);
      toast.success("Image uploaded to Cloudinary CDN successfully!");
    }
  };

  const handleError = () => {
    toast.error("Failed to upload image to Cloudinary. Check your upload preset.");
  };

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        clientAllowedFormats: ["gif", "ico", "jpeg", "jpg", "png", "svg", "webp"],
        folder,
        maxFiles: 1,
        maxFileSize: 10000000, // 10MB
        multiple: false,
        resourceType,
        sources: ["camera", "local", "url"],
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {({ open }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => {
            if (!cloudName) {
              toast.error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
              return;
            }
            open();
          }}
          className={cn(
            "border-line bg-paper/80 hover:bg-surface h-7 gap-1 px-2 font-mono text-[11px] font-semibold text-zinc-700 shadow-xs dark:text-zinc-300",
            className,
          )}
          title="Upload image or SVG to Cloudinary CDN"
        >
          <CloudArrowUpIcon className="size-3.5 text-sky-500" />
          <span>{label}</span>
        </Button>
      )}
    </CldUploadWidget>
  );
}
