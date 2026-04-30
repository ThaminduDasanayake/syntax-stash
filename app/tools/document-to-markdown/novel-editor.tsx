"use client";

import { EditorContent, EditorRoot } from "novel";
import { useState } from "react";

const TailwindEditor = () => {
  const [content, setContent] = useState(null);
  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          setContent(json);
        }}
      />
    </EditorRoot>
  );
};
export default TailwindEditor;

// "use client";
//
// import type { Editor } from "@tiptap/core";
// import { Bold, Heading1, Heading2, Italic, List, Strikethrough, Text } from "lucide-react";
// import {
//   EditorBubble,
//   EditorCommand,
//   EditorCommandEmpty,
//   EditorCommandItem,
//   EditorCommandList,
//   EditorContent,
//   EditorRoot,
// } from "novel";
// import { Command, Placeholder, renderItems, StarterKit } from "novel/extensions";
// import { useEffect, useRef } from "react";
//
// import { htmlToMarkdown, markdownToHtml } from "../helpers";
//
// // 1. Define our custom slash menu items
// const suggestionItems = [
//   {
//     title: "Text",
//     description: "Start typing with plain text.",
//     searchTerms: ["p", "paragraph"],
//     icon: <Text size={18} />,
//     command: ({ editor, range }: any) => {
//       editor.chain().focus().deleteRange(range).setNode("paragraph").run();
//     },
//   },
//   {
//     title: "Heading 1",
//     description: "Big section heading.",
//     searchTerms: ["title", "big", "large", "h1"],
//     icon: <Heading1 size={18} />,
//     command: ({ editor, range }: any) => {
//       editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
//     },
//   },
//   {
//     title: "Heading 2",
//     description: "Medium section heading.",
//     searchTerms: ["subtitle", "medium", "h2"],
//     icon: <Heading2 size={18} />,
//     command: ({ editor, range }: any) => {
//       editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
//     },
//   },
//   {
//     title: "Bullet List",
//     description: "Create a simple bulleted list.",
//     searchTerms: ["unordered", "point"],
//     icon: <List size={18} />,
//     command: ({ editor, range }: any) => {
//       editor.chain().focus().deleteRange(range).toggleBulletList().run();
//     },
//   },
// ];
//
// // 2. Configure the core Command extension with our items
// const slashCommand = Command.configure({
//   suggestion: {
//     items: () => suggestionItems,
//     render: renderItems,
//   },
// });
//
// // 3. Register the extensions
// const extensions = [
//   StarterKit,
//   slashCommand,
//   Placeholder.configure({
//     placeholder: "Markdown will appear here… Type '/' for commands",
//   }),
// ];
//
// type Props = {
//   initialMarkdown: string;
//   onChangeAction: (md: string) => void;
// };
//
// export function NovelEditor({ initialMarkdown, onChangeAction }: Props) {
//   const editorRef = useRef<Editor | null>(null);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const isInitializedRef = useRef(false);
//
//   useEffect(() => {
//     if (!isInitializedRef.current) return;
//     const editor = editorRef.current;
//     if (!editor) return;
//
//     const currentMarkdown = htmlToMarkdown(editor.getHTML());
//     if (currentMarkdown !== initialMarkdown) {
//       const html = markdownToHtml(initialMarkdown);
//       editor.commands.setContent(html || "<p></p>", false);
//     }
//   }, [initialMarkdown]);
//
//   return (
//     <div className="border-input bg-card relative rounded-md border [&_.ProseMirror]:min-h-105 [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4 [&_.ProseMirror]:outline-none">
//       <EditorRoot>
//         <EditorContent
//           extensions={extensions}
//           className="prose prose-sm dark:prose-invert max-w-none"
//           onCreate={({ editor }) => {
//             editorRef.current = editor;
//             const html = markdownToHtml(initialMarkdown);
//             editor.commands.setContent(html || "<p></p>", false);
//             isInitializedRef.current = true;
//           }}
//           onUpdate={({ editor }) => {
//             if (debounceRef.current) clearTimeout(debounceRef.current);
//             debounceRef.current = setTimeout(() => {
//               onChangeAction(htmlToMarkdown(editor.getHTML()));
//             }, 150);
//           }}
//         >
//           {/* THE BUBBLE MENU */}
//           <EditorBubble className="border-border bg-background flex w-fit items-center overflow-hidden rounded-md border shadow-xl">
//             <button
//               type="button"
//               onClick={() => editorRef.current?.chain().focus().toggleBold().run()}
//               className="text-muted-foreground hover:bg-muted hover:text-foreground p-2"
//             >
//               <Bold size={16} />
//             </button>
//             <button
//               type="button"
//               onClick={() => editorRef.current?.chain().focus().toggleItalic().run()}
//               className="text-muted-foreground hover:bg-muted hover:text-foreground p-2"
//             >
//               <Italic size={16} />
//             </button>
//             <button
//               type="button"
//               onClick={() => editorRef.current?.chain().focus().toggleStrike().run()}
//               className="text-muted-foreground hover:bg-muted hover:text-foreground p-2"
//             >
//               <Strikethrough size={16} />
//             </button>
//           </EditorBubble>
//
//           {/* THE SLASH COMMAND MENU */}
//           <EditorCommand className="border-muted bg-background z-50 h-auto max-h-82.5 w-72 overflow-y-auto rounded-md border px-1 py-2 shadow-md transition-all">
//             <EditorCommandEmpty className="text-muted-foreground px-2 py-4 text-center text-sm">
//               No results found
//             </EditorCommandEmpty>
//             <EditorCommandList>
//               <EditorCommandItem
//                 value="Text"
//                 onCommand={(val) =>
//                   editorRef.current
//                     ?.chain()
//                     .focus()
//                     .deleteRange(val.range)
//                     .setNode("paragraph")
//                     .run()
//                 }
//                 className="hover:bg-muted aria-selected:bg-muted flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
//               >
//                 <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
//                   <Text size={18} />
//                 </div>
//                 <div>
//                   <p className="font-medium">Text</p>
//                   <p className="text-muted-foreground text-xs">Start typing with plain text.</p>
//                 </div>
//               </EditorCommandItem>
//
//               <EditorCommandItem
//                 value="Heading 1"
//                 onCommand={(val) =>
//                   editorRef.current
//                     ?.chain()
//                     .focus()
//                     .deleteRange(val.range)
//                     .setNode("heading", { level: 1 })
//                     .run()
//                 }
//                 className="hover:bg-muted aria-selected:bg-muted flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
//               >
//                 <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
//                   <Heading1 size={18} />
//                 </div>
//                 <div>
//                   <p className="font-medium">Heading 1</p>
//                   <p className="text-muted-foreground text-xs">Big section heading.</p>
//                 </div>
//               </EditorCommandItem>
//
//               <EditorCommandItem
//                 value="Heading 2"
//                 onCommand={(val) =>
//                   editorRef.current
//                     ?.chain()
//                     .focus()
//                     .deleteRange(val.range)
//                     .setNode("heading", { level: 2 })
//                     .run()
//                 }
//                 className="hover:bg-muted aria-selected:bg-muted flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
//               >
//                 <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
//                   <Heading2 size={18} />
//                 </div>
//                 <div>
//                   <p className="font-medium">Heading 2</p>
//                   <p className="text-muted-foreground text-xs">Medium section heading.</p>
//                 </div>
//               </EditorCommandItem>
//
//               <EditorCommandItem
//                 value="Bullet List"
//                 onCommand={(val) =>
//                   editorRef.current?.chain().focus().deleteRange(val.range).toggleBulletList().run()
//                 }
//                 className="hover:bg-muted aria-selected:bg-muted flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
//               >
//                 <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
//                   <List size={18} />
//                 </div>
//                 <div>
//                   <p className="font-medium">Bullet List</p>
//                   <p className="text-muted-foreground text-xs">Create a simple bulleted list.</p>
//                 </div>
//               </EditorCommandItem>
//             </EditorCommandList>
//           </EditorCommand>
//         </EditorContent>
//       </EditorRoot>
//     </div>
//   );
// }
//
// // "use client";
// //
// // import type { EditorInstance } from "novel";
// // import {
// //   EditorBubble,
// //   EditorBubbleItem,
// //   EditorCommand,
// //   EditorCommandItem,
// //   EditorContent,
// //   EditorRoot,
// //   Placeholder,
// //   StarterKit,
// // } from "novel";
// // import { useEffect, useRef } from "react";
// //
// // import { htmlToMarkdown, markdownToHtml } from "../helpers";
// //
// // const extensions = [
// //   StarterKit,
// //   Placeholder.configure({
// //     placeholder: "Markdown will appear here… Feel free to edit!",
// //   }),
// // ];
// //
// // type Props = {
// //   initialMarkdown: string;
// //   onMarkdownChange: (md: string) => void;
// // };
// //
// // export function NovelEditor({ initialMarkdown, onMarkdownChange }: Props) {
// //   const editorRef = useRef<EditorInstance | null>(null);
// //   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const isInitializedRef = useRef(false);
// //
// //   useEffect(() => {
// //     if (!isInitializedRef.current) return;
// //     const editor = editorRef.current;
// //     if (!editor) return;
// //     const html = markdownToHtml(initialMarkdown);
// //     editor.commands.setContent(html || "<p></p>", false);
// //     onMarkdownChange(initialMarkdown);
// //   }, [initialMarkdown]); // eslint-disable-line react-hooks/exhaustive-deps
// //
// //   return (
// //     <EditorRoot>
// //       <EditorContent>
// //         <EditorCommand>
// //           <EditorCommandItem />
// //           <EditorCommandItem />
// //           <EditorCommandItem />
// //         </EditorCommand>
// //         <EditorBubble>
// //           <EditorBubbleItem />
// //           <EditorBubbleItem />
// //           <EditorBubbleItem />
// //         </EditorBubble>
// //       </EditorContent>
// //     </EditorRoot>
// //     // <div className="border-input bg-card rounded-md border [&_.ProseMirror]:min-h-107 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none">
// //     //   <EditorRoot>
// //     //     <EditorContent
// //     //       extensions={extensions}
// //     //       className="prose prose-sm dark:prose-invert max-w-none"
// //     //       onCreate={({ editor }) => {
// //     //         editorRef.current = editor;
// //     //         isInitializedRef.current = true;
// //     //         if (initialMarkdown) {
// //     //           const html = markdownToHtml(initialMarkdown);
// //     //           editor.commands.setContent(html, false);
// //     //         }
// //     //       }}
// //     //       onUpdate={({ editor }) => {
// //     //         if (debounceRef.current) clearTimeout(debounceRef.current);
// //     //         debounceRef.current = setTimeout(() => {
// //     //           onMarkdownChange(htmlToMarkdown(editor.getHTML()));
// //     //         }, 150);
// //     //       }}
// //     //     />
// //     //   </EditorRoot>
// //     // </div>
// //   );
// // }
