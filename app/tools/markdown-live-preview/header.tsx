import { CodeIcon, EyeIcon, FileHtmlIcon, PenIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/ui/download-button";

type EditorMode = "raw" | "rich";

interface HeaderProps {
  stats: {
    words: number;
    chars: number;
    lines: number;
  };
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  showHtml: boolean;
  setShowHtml: Dispatch<SetStateAction<boolean>>;
  markdown: string;
  renderedHtml: string;
  handleDownloadMd: () => void;
  handleDownloadHtml: () => void;
}

export function Header({
  stats,
  editorMode,
  setEditorMode,
  showHtml,
  setShowHtml,
  markdown,
  renderedHtml,
  handleDownloadMd,
  handleDownloadHtml,
}: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="bg-card divide-border flex h-8 divide-x rounded-lg border text-xs">
        <span className="flex items-center px-4">{stats.words} words</span>
        <span className="flex items-center px-4">{stats.chars} chars</span>
        <span className="flex items-center px-4">{stats.lines} lines</span>
      </div>

      <div className="flex items-center rounded-lg">
        <Button
          variant={editorMode === "raw" ? "default" : "secondary"}
          className="border-ring rounded-r-none border-r"
          onClick={() => setEditorMode("raw")}
        >
          <CodeIcon weight="duotone" />
          Raw
        </Button>
        <Button
          variant={editorMode === "rich" ? "default" : "secondary"}
          className="border-ring rounded-l-none"
          onClick={() => setEditorMode("rich")}
        >
          <PenIcon weight="duotone" />
          Rich
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Editor mode toggle */}

        <Button variant="outline" className="w-36" onClick={() => setShowHtml((v) => !v)}>
          {showHtml ? (
            <>
              <EyeIcon weight="duotone" />
              Show preview
            </>
          ) : (
            <>
              <FileHtmlIcon weight="duotone" />
              Show HTML
            </>
          )}
        </Button>
        <DownloadButton
          label="MD"
          variant="outline"
          onClick={handleDownloadMd}
          disabled={!markdown}
        />
        <DownloadButton
          label="HTML"
          variant="outline"
          onClick={handleDownloadHtml}
          disabled={!renderedHtml}
        />
      </div>
    </div>
  );
}
