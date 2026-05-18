"use client";

import { Plate, usePlateEditor } from "platejs/react";
import * as React from "react";

import { EditorKit } from "@/blocks/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor({
  initialMarkdown,
  onMarkdownChange,
}: {
  initialMarkdown: string;
  onMarkdownChange: (md: string) => void;
}) {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  React.useEffect(() => {
    if (initialMarkdown) {
      const parsedNodes = editor.api.markdown.deserialize(initialMarkdown);

      editor.tf.setValue(parsedNodes);
    }
  }, []);

  return (
    <Plate
      editor={editor}
      onChange={() => {
        const currentMarkdown = editor.api.markdown.serialize();
        onMarkdownChange(currentMarkdown);
      }}
    >
      <EditorContainer>
        <Editor variant="default" />
      </EditorContainer>
    </Plate>
  );
}
