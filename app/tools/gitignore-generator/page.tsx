"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { GITIGNORE_SNIPPETS } from "@/app/tools/gitignore-generator/data.ts";
import ToolLayout from "@/components/layout/layout.tsx";
import { Button } from "@/components/ui/button";
import ClearButton from "@/components/ui/clear-button.tsx";
import CopyButton from "@/components/ui/copy-button";
import { InputField } from "@/components/ui/input-field";
import { TextAreaField } from "@/components/ui/textarea-field";
import { developmentTools } from "@/lib/tools-data.ts";

export default function GitignoreGeneratorPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSnippets = useMemo(() => {
    return GITIGNORE_SNIPPETS.filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const generatedGitignore = useMemo(() => {
    if (selectedIds.size === 0) return "";

    const selectedSnippets = GITIGNORE_SNIPPETS.filter((s) => selectedIds.has(s.id));

    return selectedSnippets.map((snippet) => `# ${snippet.name}\n${snippet.content}`).join("\n\n");
  }, [selectedIds]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(GITIGNORE_SNIPPETS.map((s) => s.id)));
  };

  const tool = developmentTools.find((t) => t.url === "/tools/gitignore-generator");

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Select environments & frameworks</h3>

            <div className="relative">
              <MagnifyingGlassIcon
                weight="duotone"
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-4"
              />
              <InputField
                placeholder="Search stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 pl-9"
                containerClassName=""
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll} className="text-xs">
              Select All
            </Button>
            <ClearButton
              label="Clear All"
              onClick={() => setSelectedIds(new Set())}
              disabled={selectedIds.size === 0}
            />
          </div>

          {/* Toggle Grid */}
          <div className="grid gap-2">
            {filteredSnippets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No matches found</p>
            ) : (
              filteredSnippets.map((snippet) => (
                <Button
                  key={snippet.id}
                  size="lg"
                  variant={selectedIds.has(snippet.id) ? "secondary" : "outline"}
                  onClick={() => toggleSelection(snippet.id)}
                  className="flex h-15 flex-col items-start transition-all"
                >
                  <div className="font-semibold">{snippet.name}</div>
                  <div className="text-xs">{snippet.description}</div>
                </Button>
              ))
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs font-medium">
                {selectedIds.size} stack{selectedIds.size !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <TextAreaField
          label={generatedGitignore ? "Generated .gitignore" : "Select stacks to generate"}
          value={generatedGitignore}
          readOnly
          rows={24}
          className="h-full resize-none"
          placeholder="Your .gitignore will appear here..."
          action={<CopyButton value={generatedGitignore} disabled={!generatedGitignore} />}
        />
      </div>
    </ToolLayout>
  );
}
