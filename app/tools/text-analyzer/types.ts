export type AnalyzerMetrics = {
  chars: number;
  words: number;
  sentences: number;
  bytes: number;
  tokens: number;
};

export type AnalyzerStat = {
  label: string;
  value: number;
  hint?: string;
};
