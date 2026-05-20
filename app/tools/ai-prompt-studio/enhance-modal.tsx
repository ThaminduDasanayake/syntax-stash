import { TokenBadge } from "@/app/tools/ai-prompt-studio/token-badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextareaGroup } from "@/components/ui/textarea-group";

interface EnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rawPrompt: string;
  enhancedOutput: string;
  onReplace: () => void;
}

export function EnhanceModal({
  open,
  onOpenChange,
  rawPrompt,
  enhancedOutput,
  onReplace,
}: EnhanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] min-w-5xl flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Compare Enhanced Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
          <TextareaGroup
            label={<TokenBadge text={rawPrompt} label="Original" />}
            value={rawPrompt}
            readOnly
            containerClassName="h-full min-h-0"
          />
          <TextareaGroup
            label={<TokenBadge text={enhancedOutput} label="✨ Enhanced" />}
            value={enhancedOutput}
            readOnly
            containerClassName="h-full min-h-0"
          />
        </div>
        <DialogFooter className="shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <CopyButton
            textToCopy={enhancedOutput}
            disabled={!enhancedOutput}
            labelName="Copy Enhanced"
          />
          <Button variant="destructive" onClick={onReplace}>
            Replace Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
