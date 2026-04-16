import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const FilenameCopyButton = ({ filename }: { filename: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground gap-2 text-xs"
      onClick={() => copy(filename)}
    >
      <span>{filename}</span>
      {copied ? <Check className="text-emerald-400" /> : <Copy />}
    </Button>
  );
};
export default FilenameCopyButton;
