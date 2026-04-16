"use server";

import { optimize } from "svgo";

import { OptimizeResponse } from "@/app/tools/svg-optimizer/types";

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
