import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const FilenameCopyButton = ({ filename }: { filename: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copy(filename)}
      className="group text-muted-foreground hover:text-foreground gap-2 text-xs"
    >
      <span>{filename}</span>
      {copied ? (
        <Check size={14} className="text-emerald-400" />
      ) : (
        <Copy size={14} className="transition-opacity group-hover:opacity-100" />
      )}
    </Button>
  );
};
export default FilenameCopyButton;
