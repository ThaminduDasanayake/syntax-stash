"use client";

import { Plate, usePlateEditor } from "platejs/react";
import * as React from "react";

import { EditorKit } from "@/blocks/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor({
  initialMarkdown,
  onMarkdownChangeAction,
}: {
  initialMarkdown: string;
  onMarkdownChangeAction: (md: string) => void;
}) {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  React.useEffect(() => {
    if (initialMarkdown) {
      const parsedNodes = editor.api.markdown.deserialize(initialMarkdown);

      editor.tf.setValue(parsedNodes);
    }
  }, [editor, initialMarkdown]);

  return (
    <Plate
      editor={editor}
      onChange={() => {
        const currentMarkdown = editor.api.markdown.serialize();
        onMarkdownChangeAction(currentMarkdown);
      }}
    >
      <EditorContainer>
        <Editor variant="default" />
      </EditorContainer>
    </Plate>
  );
}
