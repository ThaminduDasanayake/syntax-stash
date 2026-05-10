import Fuse from "fuse.js";
import { useMemo } from "react";

export function useFuzzySearch<T>(data: T[], keys: string[]) {
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold: 0.3,
      }),
    [data, keys],
  );

  return fuse;
}
