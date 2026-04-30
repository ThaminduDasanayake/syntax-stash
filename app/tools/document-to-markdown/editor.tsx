"use client";

import { EditorContent, EditorRoot, handleCommandNavigation, type JSONContent } from "novel";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { defaultExtensions } from "./extensions";
import { slashCommand, SlashCommandMenu } from "./slash-command";

const extensions = [...defaultExtensions, slashCommand];

export default function Editor() {
  const [, setContent] = useState<JSONContent | null>(null);

  const debouncedUpdates = useDebounceCallback((editor) => {
    setContent(editor.getJSON());
  }, 500);

  return (
    <div className="border-input bg-background relative min-h-100 w-full rounded-md border">
      <EditorRoot>
        <EditorContent
          extensions={extensions}
          className="w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                "prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-semibold font-default focus:outline-none max-w-full p-8 min-h-[400px]",
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
