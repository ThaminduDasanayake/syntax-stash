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
