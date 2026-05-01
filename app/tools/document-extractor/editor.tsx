"use client";

import type { Editor as TiptapEditor } from "@tiptap/core";
import { EditorContent, EditorRoot, handleCommandNavigation, Placeholder } from "novel";
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { htmlToMarkdown, markdownToHtml } from "@/app/tools/document-extractor/helpers";

import { defaultExtensions } from "./extensions";
import { slashCommand, SlashCommandMenu } from "./slash-command";

const baseExtensions = defaultExtensions.filter(
  (ext, index, array) =>
    ext.name !== "placeholder" && array.findIndex((e) => e.name === ext.name) === index,
);

const extensions = [
  ...baseExtensions,
  slashCommand,
  Placeholder.configure({
    placeholder: "Type '/' for commands (headings, lists, etc) or start typing...",
    includeChildren: true,
  }),
];

interface EditorProps {
  initialMarkdown?: string;
  onChange?: (markdown: string) => void;
}

export default function Editor({ initialMarkdown, onChange }: EditorProps) {
  const editorRef = useRef<TiptapEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && initialMarkdown !== undefined) {
      const currentMd = htmlToMarkdown(editorRef.current.getHTML());
      if (currentMd !== initialMarkdown) {
        editorRef.current.commands.setContent(markdownToHtml(initialMarkdown), false);
      }
    }
  }, [initialMarkdown]);

  const debouncedUpdates = useDebounceCallback((editor: TiptapEditor) => {
    onChange?.(htmlToMarkdown(editor.getHTML()));
  }, 500);
  return (
    <div className="border-input bg-background relative min-h-100 w-full rounded-md border">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          key={initialMarkdown || "empty-editor"}
          extensions={extensions}
          className="w-full"
          onCreate={({ editor }) => {
            editorRef.current = editor;
            if (initialMarkdown) {
              editor.commands.setContent(markdownToHtml(initialMarkdown), false);
            }
          }}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                "prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-semibold focus:outline-none max-w-full p-8 min-h-[400px]",
            },
          }}
          onUpdate={({ editor }) => debouncedUpdates(editor)}
        >
          <SlashCommandMenu />
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
