import { FileHtmlIcon, FileMagnifyingGlassIcon, FileMdIcon, PenIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  editorMode,
  handleDownloadHtml,
  handleDownloadMd,
  markdown,
  renderedHtml,
  setEditorMode,
  setShowHtml,
  showHtml,
  stats,
}: HeaderProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="flex items-center justify-between">
        <div className="bg-card divide-border flex h-8 divide-x rounded-lg border text-xs">
          <span className="flex items-center px-4">{stats.words} words</span>
          <span className="flex items-center px-4">{stats.chars} chars</span>
          <span className="flex items-center px-4">{stats.lines} lines</span>
        </div>

        <ButtonGroup className="grid grid-cols-2">
          <Button
            variant={editorMode === "raw" ? "default" : "secondary"}
            className="border-ring rounded-r-none border-r"
            onClick={() => setEditorMode("raw")}
          >
            <FileMdIcon weight="duotone" />
            Markdown
          </Button>
          <Button
            variant={editorMode === "rich" ? "default" : "secondary"}
            className="border-ring rounded-l-none"
            onClick={() => setEditorMode("rich")}
          >
            <PenIcon weight="duotone" />
            Editor
          </Button>
        </ButtonGroup>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="w-36" onClick={() => setShowHtml((v) => !v)}>
          {showHtml ? (
            <>
              <FileMagnifyingGlassIcon weight="duotone" />
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
