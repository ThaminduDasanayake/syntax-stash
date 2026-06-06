import { CopyButton } from "@/components/ui/copy-button";

export function SetupCard({ setup }: { setup: string }) {
  return (
    <div className="flex items-center justify-between border px-4 py-2.5">
      <code className="font-mono text-sm text-teal-500">
        <span className="text-muted-foreground/50 mr-3 select-none">$</span>
        {setup}
      </code>
      <CopyButton textToCopy={setup} iconOnly variant="ghost" />
    </div>
  );
}
