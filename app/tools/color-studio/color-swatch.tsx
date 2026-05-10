import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

import { type PaletteColor } from "@/app/tools/color-studio/palette-harmonies";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const ColorSwatch = ({ color }: { color: PaletteColor }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      onClick={() => copy(color.hex)}
      className="h-auto w-full min-w-20 flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0 transition-all hover:scale-105 active:scale-95"
    >
      <div className="h-16 w-full shrink-0 border-b" style={{ backgroundColor: color.hex }} />
      <div className="bg-card flex w-full flex-col gap-0.5 p-2 font-mono">
        <div className="flex items-center justify-between gap-1">
          <p className="text-foreground truncate text-start text-[11px] font-semibold">
            {color.hex}
          </p>
          {copied ? (
            <CheckIcon className="shrink-0 text-emerald-400" />
          ) : (
            <CopyIcon className="text-muted-foreground shrink-0" />
          )}
        </div>
        <p className="text-muted-foreground truncate text-start text-[9px]">{color.hsl}</p>
      </div>
    </Button>
  );
};

export default ColorSwatch;
