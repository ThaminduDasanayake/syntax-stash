"use server";

import { optimize } from "svgo";

import { OptimizeResponse } from "@/app/tools/svg-optimizer/types";

export async function optimizeSvg(input: string): Promise<OptimizeResponse> {
  try {
    const result = optimize(input, { multipass: true });
    return {
      optimizedSize: Buffer.byteLength(result.data, "utf8"),
      originalSize: Buffer.byteLength(input, "utf8"),
      svg: result.data,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid SVG" };
  }
}
