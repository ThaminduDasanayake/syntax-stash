"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface UserCollection {
  createdAt: string;
  description?: string | null;
  id: string;
  isPublic: boolean;
  itemCount: number;
  name: string;
  slug: string;
  updatedAt: string;
}

export function useCollections() {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/collections");
      const data = await res.json();
      if (res.ok && data.collections) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error("Failed to load collections:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = async (params: {
    description?: string;
    isPublic?: boolean;
    name: string;
  }) => {
    try {
      const res = await fetch("/api/collections", {
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.collection) {
        setCollections((prev) => [data.collection, ...prev]);
        toast.success(`Collection "${params.name}" created.`);
        return data.collection;
      } else {
        toast.error(data.error || "Failed to create collection.");
        return null;
      }
    } catch {
      toast.error("Network error creating collection.");
      return null;
    }
  };

  const updateCollection = async (
    id: string,
    updates: { description?: string; isPublic?: boolean; name?: string },
  ) => {
    try {
      const res = await fetch(`/api/collections/${id}`, {
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const data = await res.json();

      if (res.ok && data.collection) {
        setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...data.collection } : c)));
        toast.success("Collection updated.");
        return data.collection;
      } else {
        toast.error(data.error || "Failed to update collection.");
        return null;
      }
    } catch {
      toast.error("Network error updating collection.");
      return null;
    }
  };

  const deleteCollection = async (id: string) => {
    const target = collections.find((c) => c.id === id);
    setCollections((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (target) setCollections((prev) => [target, ...prev]);
        toast.error(data.error || "Failed to delete collection.");
      } else {
        toast.success("Collection deleted.");
      }
    } catch {
      if (target) setCollections((prev) => [target, ...prev]);
      toast.error("Network error deleting collection.");
    }
  };

  return {
    collections,
    createCollection,
    deleteCollection,
    isLoading,
    refreshCollections: fetchCollections,
    updateCollection,
  };
}
