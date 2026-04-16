export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  starter: string;
  category: "coding" | "writing" | "analysis";
};
