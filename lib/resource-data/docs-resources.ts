import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const documentationLinks: Tool[] = [
  {
    title: "Accept: text/markdown",
    category: CATEGORIES.docs,
    description:
      "Serve Markdown to AI agents and LLMs via the Accept: text/markdown header. Browsers get HTML, agents get clean Markdown.",
    subtitle: "Serve Markdown to AI Agents with Accept Headers",
    tags: [TAGS.markdown, TAGS.tool],
    url: "https://acceptmarkdown.com/",
  },
  {
    title: "Alexandrie",
    author: "Alexandrie Team",
    category: CATEGORIES.docs,
    description:
      "Alexandrie is a modern note-taking and knowledge base application built for students & creators. Write, organize and render beautiful notes using extended Markdown in a fast, clean and distraction-free interface. Self-hostable with Docker.",
    subtitle: "Modern Markdown Note-Taking & Knowledge Base App",
    url: "https://alexandrie-hub.fr/",
  },
  {
    title: "Anytype",
    category: CATEGORIES.docs,
    description:
      "Create notes, tasks, databases, and chats that only you can access. Your data stays on your device — fully owned, secure, and private. Free to start.",
    subtitle: "A safe haven for digital collaboration",
    url: "https://anytype.io/",
  },
  {
    title: "docmd",
    category: CATEGORIES.docs,
    description:
      "The zero-config documentation engine that starts instantly and scales with you, fast, SEO-friendly, and AI-ready by default.",
    subtitle: "Build production-ready documentation from Markdown in seconds",
    url: "https://docmd.io/",
  },
  {
    title: "docsify",
    category: CATEGORIES.docs,
    description: "A magical documentation generator.",
    favicon: "https://docsify.js.org/_media/icon.svg",
    url: "https://docsify.js.org/#/",
  },
  {
    title: "emailmd",
    category: CATEGORIES.docs,
    description:
      "Turn markdown into responsive, email-safe HTML that renders perfectly across every client.",
    subtitle: "Responsive Emails, Written in Markdown",
    tags: [TAGS.email, TAGS.markdown],
    url: "https://www.emailmd.dev/",
  },
  {
    title: "Fumadocs",
    category: CATEGORIES.docs,
    description: "The React.js documentation framework.",
    favicon: "https://www.fumadocs.dev/icon.png",
    ogImage: "https://www.fumadocs.dev/banner.png",
    tags: [TAGS.react],
    url: "https://www.fumadocs.dev/",
  },
  {
    title: "GitDocify",
    category: CATEGORIES.docs,
    description:
      "Turn any GitHub repository into structured, source-grounded documentation with GitDocify.",
    favicon: "https://gitdocify.com/brand/logo-mark-primary.png",
    ogImage: "https://gitdocify.com/brand/social-preview.png",
    subtitle: "Instant, Professional Code Documentation",
    tags: [TAGS.development],
    url: "https://gitdocify.com/",
  },
  {
    title: "Markdown Editor Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free online Markdown editor with instant live preview — GitHub-style preview, README & blog templates, visual table generator, Mermaid diagrams, math, share links, export to HTML/MD/PDF. Auto-saves in your browser. No sign-up, no upload.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/markdown-live-editor/og-image.png",
    subtitle: "Live Preview, GitHub Style, Templates & HTML/PDF Export",
    tags: [TAGS.markdown],
    url: "https://jasperbernaers.com/markdown-live-editor/",
  },
  {
    title: "Material for MkDocs",
    author: "Martin Donath",
    category: CATEGORIES.docs,
    description:
      "Write your documentation in Markdown and create a professional static site in minutes – searchable, customizable, in 60+ languages, for all devices",
    tags: [TAGS.markdown, TAGS.tool],
    url: "https://squidfunk.github.io/mkdocs-material/",
  },
  {
    title: "Mintlify",
    category: CATEGORIES.docs,
    description: "Self-updating documentation for startups, enterprises, and agents.",
    favicon: "https://raw.githubusercontent.com/mintlify/starter/main/favicon.svg",
    ogImage: "https://www.mintlify.com/_next/static/media/og.28576e75.png",
    subtitle: "The Knowledge Platform Built for Agents",
    tags: [TAGS.tool],
    url: "https://www.mintlify.com/",
  },
  {
    title: "Online Notepad",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "A free online notepad that opens instantly — just start typing. Autosaves in your browser, no login, no install, works offline. Line numbers, tabs and syntax highlighting when you need them, so it doubles as a Notepad++ alternative on any device.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/notepad/og-image.png",
    subtitle: "Free, Autosave, No Sign-Up | Notepad++ Alternative",
    tags: [TAGS.editor, TAGS.tool],
    url: "https://jasperbernaers.com/notepad/",
  },
  {
    title: "Quarkdown",
    category: CATEGORIES.docs,
    description:
      "Quarkdown is a modern, open-source, Markdown-based typesetting system for creating papers, presentations, knowledge bases and static websites.",
    subtitle: "Markdown with superpowers",
    tags: [TAGS.development],
    url: "https://quarkdown.com/",
  },
  {
    title: "readme.so",
    category: CATEGORIES.docs,
    description:
      "Use readme.so's markdown editor and templates to easily create a ReadMe for your projects",
    favicon: "https://readme.so/readme.svg",
    ogImage: "https://readme.so/screenshot.png",
    url: "https://readme.so/",
  },
  {
    title: "Slidev",
    author: "Anthony Fu",
    category: CATEGORIES.docs,
    description: "Presentation slides for developers",
    favicon: "https://sli.dev/logo.svg",
    ogImage: "https://sli.dev/og-image.png",
    tags: [TAGS.presentation],
    url: "https://sli.dev/",
  },
];
