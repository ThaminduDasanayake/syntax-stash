"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { TagItem } from "@/lib/tags";
import { normalizeTag } from "@/lib/utils";

let cachedTags: TagItem[] | null = null;
const listeners = new Set<(tags: TagItem[]) => void>();

export function useTags() {
  const [tags, setTags] = useState<TagItem[]>(cachedTags || []);
  const [isLoading, setIsLoading] = useState(!cachedTags);

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tags");
      if (!res.ok) return;
      const data = await res.json();
      if (data.tags && Array.isArray(data.tags)) {
        cachedTags = data.tags;
        setTags(data.tags);
        listeners.forEach((listener) => listener(data.tags));
      }
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newTags: TagItem[]) => setTags(newTags);
    listeners.add(handleUpdate);

    if (!cachedTags) {
      fetchTags();
    } else {
      setTags(cachedTags);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, [fetchTags]);

  const tagOptions = useMemo(() => {
    return tags.map((t) => ({
      label: `#${t.name}`,
      slug: t.slug || normalizeTag(t.name),
      value: t.name,
    }));
  }, [tags]);

  return {
    isLoading,
    refetch: fetchTags,
    tagOptions,
    tags,
  };
}
