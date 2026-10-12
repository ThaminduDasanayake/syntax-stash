"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CategoryItem } from "@/lib/categories";

let cachedCategories: CategoryItem[] | null = null;
const listeners = new Set<(cats: CategoryItem[]) => void>();

export function registerNewCategoryLocally(newCat: CategoryItem) {
  if (!cachedCategories) {
    cachedCategories = [newCat];
  } else if (
    !cachedCategories.some(
      (c) => c.slug === newCat.slug || c.name.toLowerCase() === newCat.name.toLowerCase(),
    )
  ) {
    cachedCategories = [...cachedCategories, newCat].sort((a, b) => a.name.localeCompare(b.name));
  }
  listeners.forEach((listener) => listener(cachedCategories!));
}

export function invalidateCategoriesCache() {
  cachedCategories = null;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(cachedCategories || []);
  const [isLoading, setIsLoading] = useState(!cachedCategories);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories");
      if (!res.ok) return;
      const data = await res.json();
      if (data.categories && Array.isArray(data.categories)) {
        cachedCategories = data.categories;
        setCategories(data.categories);
        listeners.forEach((listener) => listener(data.categories));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (cats: CategoryItem[]) => setCategories(cats);
    listeners.add(handleUpdate);

    if (!cachedCategories) {
      fetchCategories();
    } else {
      setCategories(cachedCategories);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, [fetchCategories]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
  }, [categories]);

  return {
    categories,
    categoryOptions,
    isLoading,
    refetch: fetchCategories,
  };
}
