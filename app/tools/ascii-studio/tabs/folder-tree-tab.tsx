"use client";

import { useMemo, useState } from "react";

import { SAMPLE_TREE } from "@/app/tools/ascii-studio/constants";
import { parseIndentedList, renderFolderTree } from "@/app/tools/ascii-studio/helpers";
import { CopyButton } from "@/components/ui/copy-button";
import { TextAreaField } from "@/components/ui/textarea-field";

export function FolderTreeTab() {
  const [input, setInput] = useState(SAMPLE_TREE);

  const output = useMemo(() => {
    const nodes = parseIndentedList(input);
    return renderFolderTree(nodes);
  }, [input]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TextAreaField
        label="Indented List"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`src/\n  components/\n    Button.tsx\n  utils.ts`}
        rows={18}
        textClassName="font-mono text-sm"
      />

      <TextAreaField
        label="Folder Tree"
        readOnly
        value={output}
        rows={18}
        textClassName="font-mono text-sm"
        action={<CopyButton value={output} disabled={!output} />}
      />
    </div>
  );
}
