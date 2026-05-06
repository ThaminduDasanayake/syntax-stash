"use client";

import {
  CodeIcon,
  CodeSimpleIcon,
  LinkIcon,
  ListBulletsIcon,
  ListChecksIcon,
  ListNumbersIcon,
  MinusIcon,
  QuotesIcon,
  TextAlignLeftIcon,
  TextBIcon,
  TextHOneIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from "@phosphor-icons/react";
import {
  Command,
  createSuggestionItems,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  renderItems,
} from "novel";

export const suggestionItems = createSuggestionItems([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <TextAlignLeftIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large", "h1"],
    icon: <TextHOneIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium", "h2"],
    icon: <TextHTwoIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small", "h3"],
    icon: <TextHThreeIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bold",
    description: "Toggle bold for the next text you type.",
    searchTerms: ["strong", "b"],
    icon: <TextBIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run();
    },
  },
  {
    title: "Italic",
    description: "Toggle italic for the next text you type.",
    searchTerms: ["em", "i", "emphasis"],
    icon: <TextItalicIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleItalic().run();
    },
  },
  {
    title: "Strikethrough",
    description: "Toggle strikethrough for the next text you type.",
    searchTerms: ["strike", "s", "del"],
    icon: <TextStrikethroughIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleStrike().run();
    },
  },
  {
    title: "Inline Code",
    description: "Format the next text as inline code.",
    searchTerms: ["code", "monospace", "tt"],
    icon: <CodeIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCode().run();
    },
  },
  {
    title: "Link",
    description: "Add a hyperlink to selected or upcoming text.",
    searchTerms: ["url", "href", "anchor"],
    icon: <LinkIcon size={20} />,
    command: ({ editor, range }) => {
      const url = window.prompt("Enter URL");
      if (!url) {
        editor.chain().focus().deleteRange(range).run();
        return;
      }
      editor.chain().focus().deleteRange(range).setLink({ href: url }).run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <ListChecksIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point", "ul"],
    icon: <ListBulletsIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered", "ol"],
    icon: <ListNumbersIcon size={20} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote", "cite"],
    icon: <QuotesIcon size={20} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code Block",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock", "pre", "code"],
    icon: <CodeSimpleIcon size={20} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Insert a horizontal divider.",
    searchTerms: ["hr", "rule", "line", "divider", "separator"],
    icon: <MinusIcon size={20} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

export function SlashCommandMenu() {
  return (
    <EditorCommand className="border-muted bg-background z-50 h-auto max-h-82.5 w-72 overflow-y-auto rounded-md border px-1 py-2 shadow-md transition-all">
      <EditorCommandEmpty className="text-muted-foreground px-2 text-sm">
        No results
      </EditorCommandEmpty>
      <EditorCommandList>
        {suggestionItems.map((item) => (
          <EditorCommandItem
            key={item.title}
            value={item.title}
            onCommand={(val) => item.command?.(val)}
            className="hover:bg-accent aria-selected:bg-accent flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
          >
            <div className="border-muted bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">{item.description}</p>
            </div>
          </EditorCommandItem>
        ))}
      </EditorCommandList>
    </EditorCommand>
  );
}
