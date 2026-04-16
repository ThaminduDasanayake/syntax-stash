import fs from "fs";
import path from "path";
import { codeToHtml } from "shiki";

import { Snippet } from "@/app/tools/code-stash/types";

const VAULT_PATH = path.join(process.cwd(), "content/snippets");

function getFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFilesRecursively(res) : res;
  });
}

export async function getAllSnippets(): Promise<Snippet[]> {
  const allPaths = getFilesRecursively(VAULT_PATH);

  // The JSON file - master index for a snippet
  const jsonFiles = allPaths.filter((p) => p.endsWith(".json"));

  const snippets: Snippet[] = [];

  for (const jsonPath of jsonFiles) {
    const content = fs.readFileSync(jsonPath, "utf8");
    const metadata = JSON.parse(content);

    // Ignore files that are not valid metadata indexes
    if (!Array.isArray(metadata.files)) continue;

    const dir = path.dirname(jsonPath);
    const id = path.basename(jsonPath, ".json");
    const fileList: (string | { file: string; language: string })[] = metadata.files;

    const processedFiles = await Promise.all(
      fileList.map(async (item) => {
        // Support both explicit objects { file, language } and legacy strings "file.ts"
        const isString = typeof item === "string";
        const filename = isString ? item : item.file;
        const explicitLang = isString ? null : item.language;

        const filePath = path.join(dir, filename);
        const code = fs.existsSync(filePath)
          ? fs.readFileSync(filePath, "utf8").trim()
          : "// File missing";

        const ext = path.extname(filename).slice(1);

        const language = String(explicitLang || ext).toLowerCase();

        const html = await (codeToHtml(code, {
          lang: language,
          theme: "plastic",
        }) as Promise<string>);

        return { filename, language, code, html };
      }),
    );

    snippets.push({
      id,
      title: metadata.title,
      description: metadata.description || "",
      languages: metadata.languages,
      setup: metadata.setup,
      instructions: metadata.instructions,
      files: processedFiles,
    });
  }

  return snippets;
}
