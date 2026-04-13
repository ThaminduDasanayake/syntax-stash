import { Metadata } from "next";

import { getAllSnippets } from "@/lib/snippets";

import CodeStashUI from "./CodeStashUI";

export const metadata: Metadata = {
  title: "Code Stash | syntax-stash",
  description: "A curated library of developer snippets.",
};

export default async function CodeStashPage() {
  const snippets = await getAllSnippets();
  return <CodeStashUI initialSnippets={snippets} />;
}
