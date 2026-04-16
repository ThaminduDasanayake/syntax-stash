import { Metadata } from "next";

import { getAllSnippets } from "@/app/tools/code-stash/snippets";

import CodeStashUi from "./code-stash-ui";

export const metadata: Metadata = {
  title: "Code Stash | syntax-stash",
  description: "A curated library of developer snippets.",
};

export default async function CodeStashPage() {
  const snippets = await getAllSnippets();
  return <CodeStashUi initialSnippets={snippets} />;
}
