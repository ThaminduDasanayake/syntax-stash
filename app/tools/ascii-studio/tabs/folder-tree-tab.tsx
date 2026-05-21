"use client";

import { useMemo, useState } from "react";

import { SAMPLE_TREE } from "@/app/tools/ascii-studio/constants";
import { parseIndentedList, renderFolderTree } from "@/app/tools/ascii-studio/helpers";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";

export function FolderTreeTab() {
  const [input, setInput] = useState(SAMPLE_TREE);

  const output = useMemo(() => {
    const nodes = parseIndentedList(input);
    return renderFolderTree(nodes);
  }, [input]);

  return (
    <div className="grid h-full! min-h-0 w-full flex-1! grid-cols-1 gap-6 lg:grid-cols-2">
      <TextareaGroup
        label="Indented List"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`src/\n  components/\n    Button.tsx\n  utils.ts`}
        action={
          <ClearButton
            size="sm"
            onClick={() => {
              setInput("");
            }}
            disabled={!input}
          />
        }
        containerClassName="h-full min-h-0"
      />

      <TextareaGroup
        label="Folder Tree"
        readOnly
        value={output}
        action={<CopyButton iconOnly textToCopy={output} disabled={!output} />}
        containerClassName="h-full min-h-0"
      />
    </div>
  );
}
