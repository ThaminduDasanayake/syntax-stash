import { CopyButton } from "@/components/ui/copy-button";

interface FileProps {
  filename: string;
  code: string;
  html: string;
}

interface FileCardProps {
  file: FileProps;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-2xl">
      {/* Title bar */}
      <div className="border-accent flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="mr-2 flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>

          <CopyButton
            textToCopy={file.filename}
            labelName={file.filename}
            copiedLabelName={file.filename}
            variant="ghost"
          />
        </div>

        <CopyButton textToCopy={file.code} iconOnly />
      </div>

      <div
        className="overflow-x-auto p-4 text-sm [&>pre]:m-0! [&>pre]:bg-transparent! [&>pre]:p-0!"
        dangerouslySetInnerHTML={{ __html: file.html }}
      />
    </div>
  );
}
