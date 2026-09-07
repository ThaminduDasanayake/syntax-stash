"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthorWithResources, slugifyAuthor } from "@/lib/authors";

let cachedAuthors: AuthorWithResources[] | null = null;
const listeners = new Set<(authors: AuthorWithResources[]) => void>();

export function useAuthors() {
  const [authors, setAuthors] = useState<AuthorWithResources[]>(cachedAuthors || []);
  const [isLoading, setIsLoading] = useState(!cachedAuthors);

  const fetchAuthors = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/authors");
      if (!res.ok) return;
      const data = await res.json();
      if (data.authors && Array.isArray(data.authors)) {
        cachedAuthors = data.authors;
        setAuthors(data.authors);
        listeners.forEach((listener) => listener(data.authors));
      }
    } catch (err) {
      console.error("Failed to load authors:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newAuthors: AuthorWithResources[]) => setAuthors(newAuthors);
    listeners.add(handleUpdate);

    if (!cachedAuthors) {
      fetchAuthors();
    } else {
      setAuthors(cachedAuthors);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, [fetchAuthors]);

  const authorOptions = useMemo(() => {
    return authors.map((a) => ({
      label: a.name,
      slug: a.slug || slugifyAuthor(a.name),
      value: a.name,
    }));
  }, [authors]);

  return {
    authorOptions,
    authors,
    isLoading,
    refetch: fetchAuthors,
  };
}
