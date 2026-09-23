"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  CandidateOption,
  DuplicateUrlItem,
  SuggestedAuthorData,
} from "@/components/submissions";

export interface MetadataScanResult {
  author?: string;
  authorBlog?: string;
  authorGitHub?: string;
  authorLinkedIn?: string;
  authorTwitter?: string;
  authorWebsite?: string;
  authorYouTube?: string;
  category?: string;
  description?: string;
  existingResource?: DuplicateUrlItem | null;
  existingSubmission?: DuplicateUrlItem | null;
  favicon?: string;
  faviconOptions?: CandidateOption[];
  github?: string;
  ogImage?: string;
  ogImageOptions?: CandidateOption[];
  subtitle?: string;
  title?: string;
}

export interface DetectedFieldUpdates {
  description?: string;
  github?: string;
  subtitle?: string;
  title?: string;
}

export interface DuplicateNoticeState {
  item: DuplicateUrlItem;
  type: "resource" | "submission";
}

export interface CurrentFieldComparison {
  currentId?: string;
  description?: string | null;
  github?: string | null;
  subtitle?: string | null;
  title?: string | null;
}

export function useMetadataScanner() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [faviconOptions, setFaviconOptions] = useState<CandidateOption[]>([]);
  const [ogImageOptions, setOgImageOptions] = useState<CandidateOption[]>([]);
  const [suggestedAuthor, setSuggestedAuthor] = useState<SuggestedAuthorData | null>(null);
  const [detectedUpdates, setDetectedUpdates] = useState<DetectedFieldUpdates>({});
  const [duplicateNotice, setDuplicateNotice] = useState<DuplicateNoticeState | null>(null);

  const resetScanner = useCallback(() => {
    setFaviconOptions([]);
    setOgImageOptions([]);
    setSuggestedAuthor(null);
    setDetectedUpdates({});
    setDuplicateNotice(null);
  }, []);

  const scanUrl = useCallback(
    async (
      targetUrl: string,
      current: CurrentFieldComparison = {},
      isEdit = false,
    ): Promise<MetadataScanResult | null> => {
      const cleanUrl = targetUrl?.trim();
      if (!cleanUrl) {
        toast.warning("Please enter a URL first.");
        return null;
      }

      try {
        setIsDetecting(true);
        const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(cleanUrl)}`);
        const data: MetadataScanResult & { error?: string } = await res.json();

        if (res.ok && !data.error) {
          if (data.faviconOptions) setFaviconOptions(data.faviconOptions);
          if (data.ogImageOptions) setOgImageOptions(data.ogImageOptions);

          if (data.author && data.author.trim()) {
            setSuggestedAuthor({
              blog: data.authorBlog || "",
              github: data.authorGitHub || "",
              linkedin: data.authorLinkedIn || "",
              name: data.author.trim(),
              twitter: data.authorTwitter || "",
              website: data.authorWebsite || "",
              youtube: data.authorYouTube || "",
            });
          }

          const newDetected: DetectedFieldUpdates = {};

          if (
            data.title &&
            current.title &&
            current.title.trim().toLowerCase() !== data.title.trim().toLowerCase()
          ) {
            newDetected.title = data.title.trim();
          }

          if (
            data.subtitle &&
            current.subtitle &&
            current.subtitle.trim().toLowerCase() !== data.subtitle.trim().toLowerCase()
          ) {
            newDetected.subtitle = data.subtitle.trim();
          } else if (!data.subtitle && current.subtitle && current.subtitle.trim()) {
            newDetected.subtitle = "";
          }

          if (
            data.description &&
            current.description &&
            current.description.trim().toLowerCase() !== data.description.trim().toLowerCase()
          ) {
            newDetected.description = data.description.trim();
          }

          if (
            data.github &&
            current.github &&
            current.github.trim().toLowerCase() !== data.github.trim().toLowerCase()
          ) {
            newDetected.github = data.github.trim();
          }

          setDetectedUpdates(newDetected);

          if (
            data.existingResource &&
            (!isEdit || data.existingResource.id !== current.currentId)
          ) {
            setDuplicateNotice({
              item: data.existingResource,
              type: "resource",
            });
            toast.warning(
              `A resource with this URL already exists: "${data.existingResource.title}" (${data.existingResource.category})`,
            );
          } else if (data.existingSubmission) {
            setDuplicateNotice({
              item: data.existingSubmission,
              type: "submission",
            });
            toast.info(`This URL has a pending submission: "${data.existingSubmission.title}"`);
          } else {
            setDuplicateNotice(null);
            toast.success("Metadata detected successfully!");
          }

          return data;
        } else {
          toast.error(data.error || "Failed to auto-detect metadata.");
          return null;
        }
      } catch (err) {
        console.error("Metadata auto-detection failed:", err);
        toast.error("Network error while detecting metadata.");
        return null;
      } finally {
        setIsDetecting(false);
      }
    },
    [],
  );

  return {
    detectedUpdates,
    duplicateNotice,
    faviconOptions,
    isDetecting,
    ogImageOptions,
    resetScanner,
    scanUrl,
    setDetectedUpdates,
    setDuplicateNotice,
    setFaviconOptions,
    setOgImageOptions,
    setSuggestedAuthor,
    suggestedAuthor,
  };
}

export function mergeScannedMetadata<
  T extends {
    category?: string | null;
    description?: string | null;
    favicon?: string | null;
    github?: string | null;
    ogImage?: string | null;
    subtitle?: string | null;
    title?: string | null;
  },
>(current: T, scanned: MetadataScanResult, defaultCategory = ""): T {
  return {
    ...current,
    title: current.title || scanned.title || "",
    category: current.category || scanned.category || defaultCategory,
    description: current.description || scanned.description || "",
    favicon: current.favicon || scanned.favicon || "",
    github: current.github || scanned.github || "",
    ogImage: current.ogImage || scanned.ogImage || "",
    subtitle: current.subtitle || scanned.subtitle || "",
  };
}
