"use client";

import { Download, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClearButton from "@/components/ui/clear-button";
import { Label } from "@/components/ui/label";
import { TextAreaField } from "@/components/ui/textarea-field";

function getImageDataUri(base64String: string): string | null {
  const trimmed = base64String.trim();

  if (!trimmed) {
    return null;
  }

  // Check if it already has the data URI scheme
  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  // Check if it looks like base64 (only contains valid base64 chars)
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed)) {
    return null;
  }

  // Try to detect the image format from the base64 data
  // PNG: iVBORw0KGgo=
  // JPG: /9j/
  // GIF: R0lGODlh
  // WebP: UklGR
  // SVG: PD94bW or PHN2Z

  let imageType = "png"; // default

  if (trimmed.startsWith("/9j/")) {
    imageType = "jpeg";
  } else if (trimmed.startsWith("R0lGODlh")) {
    imageType = "gif";
  } else if (trimmed.startsWith("UklGR")) {
    imageType = "webp";
  } else if (trimmed.startsWith("PD94bW") || trimmed.startsWith("PHN2Z")) {
    imageType = "svg+xml";
  }

  return `data:image/${imageType};base64,${trimmed}`;
}

export default function Base64ImagePage() {
  const [base64Input, setBase64Input] = useState("");

  const imageDataUri = useMemo(() => getImageDataUri(base64Input), [base64Input]);

  const isValidImage = imageDataUri !== null;

  function handleDownload() {
    if (!imageDataUri) return;

    let extension = "png";

    const mimeMatch = imageDataUri.match(/data:image\/([^;]+);/);

    if (mimeMatch && mimeMatch[1]) {
      const subtype = mimeMatch[1];

      // Map the MIME subtypes to their proper file extensions
      if (subtype === "svg+xml") {
        extension = "svg";
      } else if (subtype === "jpeg") {
        extension = "jpg";
      } else {
        extension = subtype; // smoothly handles 'png', 'gif', 'webp'
      }
    }

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageDataUri;
    link.download = `decoded-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <ToolLayout
      icon={ImageIcon}
      title="Base64 Image"
      highlight="Decoder"
      description="Decode and preview base64-encoded images directly in your browser."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Input */}

        <div className="space-y-3">
          <TextAreaField
            label="Base64 String"
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder={
              'Paste your Base64 string here...\n\nWith or without the "data:image/png;base64," prefix.\n\nSupports: PNG, JPEG, GIF, WebP, SVG'
            }
            className="min-h-108"
            action={
              <ClearButton
                onClick={() => {
                  setBase64Input("");
                }}
                disabled={!base64Input}
              />
            }
          />

          <p className="text-muted-foreground text-xs">
            Paste the Base64 string with or without the data URI scheme. If the scheme is missing,
            it will be auto-detected based on the image format.
          </p>
        </div>

        {/* Right Column: Preview */}
        <div className="mt-2.5 space-y-4">
          <Label className="">Preview</Label>
          <Card className="overflow-hidden bg-white">
            <CardContent className="flex min-h-100 items-center justify-center p-4">
              {base64Input.trim() === "" ? (
                <p className="text-muted-foreground text-center text-sm">
                  Paste a Base64 string to preview the image here
                </p>
              ) : isValidImage ? (
                <img
                  src={imageDataUri}
                  alt="Decoded Base64 Image"
                  className="max-h-125 max-w-full rounded-lg object-contain"
                />
              ) : (
                <div className="space-y-2 text-center">
                  <p className="text-destructive text-sm font-medium">Invalid Base64 String</p>
                  <p className="text-muted-foreground text-xs">
                    The input does not appear to be valid Base64 data or a recognized image format.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supported formats: PNG, JPEG, GIF, WebP, SVG
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {isValidImage && base64Input.trim() !== "" && (
            <Button onClick={handleDownload} className="h-10 w-full gap-2">
              <Download size={16} />
              <span>Download Image</span>
            </Button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 border-border mt-8 space-y-3 rounded-lg border p-4">
        <h4 className="text-foreground text-sm font-semibold">About Base64 Images</h4>
        <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
          <div className="space-y-2">
            <p>
              <span className="text-foreground font-semibold">Data URI Scheme:</span> Base64 images
              are typically prefixed with a scheme like{" "}
              <code className="bg-background rounded px-1 py-0.5 text-[10px]">
                data:image/png;base64,
              </code>
            </p>
            <p>
              <span className="text-foreground font-semibold">Auto-Detection:</span> This tool
              auto-detects missing schemes and infers the image format from the Base64 data.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="text-foreground font-semibold">Supported Formats:</span> PNG, JPEG,
              GIF, WebP, SVG+XML
            </p>
            <p>
              <span className="text-foreground font-semibold">Local Processing:</span> All decoding
              happens in your browser with zero server requests.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
