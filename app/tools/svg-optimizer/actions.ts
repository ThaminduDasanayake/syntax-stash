"use server";

import { optimize } from "svgo";

export interface OptimizeResult {
  svg: string;
  originalSize: number;
  optimizedSize: number;
  error?: never;
}

export interface OptimizeError {
  error: string;
  svg?: never;
  originalSize?: never;
  optimizedSize?: never;
}

export type OptimizeResponse = OptimizeResult | OptimizeError;

export async function optimizeSvg(input: string): Promise<OptimizeResponse> {
  try {
    const result = optimize(input, { multipass: true });
    return {
      svg: result.data,
      originalSize: Buffer.byteLength(input, "utf8"),
      optimizedSize: Buffer.byteLength(result.data, "utf8"),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid SVG" };
  }
}
