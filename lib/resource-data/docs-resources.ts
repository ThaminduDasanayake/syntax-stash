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
    title: "DevDocs API Documentation",
    category: CATEGORIES.docs,
    description:
      "Fast, offline, and free documentation browser for developers. Search 100+ docs in one web app: HTML, CSS, JavaScript, PHP, Ruby, Python, Go, C, C++…",
    tags: [TAGS.tool],
    url: "https://devdocs.io/",
  },
  {
    title: "Devhints",
    author: "Rico Sta. Cruz",
    category: CATEGORIES.docs,
    description: "A ridiculous collection of web development cheatsheets",
    subtitle: "TL;DR for developer documentation",
    tags: [TAGS.development, TAGS.education],
    url: "https://devhints.io/",
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
    title: "Free Email Signature Generator",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free email signature generator. Create a professional HTML email signature with your logo, social links and contact details, then copy the code into Outlook, Gmail or Apple Mail. Live preview, no signup, no watermark, 100% free and private.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/email-signature/og-image.png",
    subtitle: "HTML Signatures for Outlook, Gmail & Apple Mail",
    tags: [TAGS.email],
    url: "https://jasperbernaers.com/email-signature/",
  },
  {
    title: "Free Invoice Generator Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free online invoice generator — create professional invoices in seconds. Add line items, tax, discounts, your logo. Export print-ready PDF instantly. No sign-up, no watermark, no ads. 100% browser-based and private. Best free alternative to Wave, Zoho Invoice, and FreshBooks.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/invoice-generator/og-image.png",
    subtitle: "Create & Download PDF Invoices | No Sign-Up, No Watermark",
    url: "https://jasperbernaers.com/invoice-generator/",
  },
  {
    title: "Free PDF Tools Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free online PDF tools — merge PDF files into one, split PDF by pages, compress PDF size by 80%, convert PDF to JPG images, convert JPG to PDF, rotate and organize pages. 100% browser-based with no file upload to any server. No watermarks, no daily limits, no registration. Best free alternative to SmallPDF, iLovePDF, PDF24, Sejda and Adobe Acrobat online. Works on Windows, Mac, Linux, iPhone and Android.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/pdf/og-image.png",
    subtitle: "Merge, Split, Compress, Convert PDF to JPG | No Upload, No Watermark, No Sign‑Up",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://jasperbernaers.com/pdf/",
  },
  {
    title: "Free PDF Translator",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free browser-based PDF translator. Extract text from any PDF and translate it to 100+ languages instantly. No upload, no server, 100% private. Powered by MyMemory.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/pdf-translator/og-image.png",
    subtitle: "Translate PDFs to Any Language",
    tags: [TAGS.pdf],
    url: "https://jasperbernaers.com/pdf-translator/",
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
    title: "iLovePDF",
    category: CATEGORIES.docs,
    description:
      "iLovePDF is an online service to work with PDF files completely free and easy to use. Merge PDF, split PDF, compress PDF, office to PDF, PDF to JPG and more!",
    favicon: "https://www.ilovepdf.com/img/app-icon.png",
    ogImage: "https://www.ilovepdf.com/img/ilovepdf/social/en-US/ilovepdf.png",
    subtitle: "Online PDF tools for PDF lovers",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://www.ilovepdf.com/",
  },
  {
    title: "Invoice Builder",
    author: "piratuks",
    category: CATEGORIES.docs,
    description:
      "Invoice and quotation builder desktop app with PDF export, designed for small businesses and freelancers. Create, manage, and export invoices and quotes easily using a local database in an Electron-based app.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/f50c07ae3a04dedde35800ded790b1ed85d154e313f6e136a5cc3c7e256c5d65/piratuks/invoice-builder",
    url: "https://github.com/piratuks/invoice-builder",
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
    title: "Matter.",
    author: "Hayk An",
    category: CATEGORIES.frontend,
    description: "A task manager that highlights what matters most to you",
    favicon: "https://hihayk.github.io/matter/favicon.ico",
    ogImage: "https://raw.githubusercontent.com/hihayk/matter/master/docs/shot.png",
    url: "https://hihayk.github.io/matter/",
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
    title: "OverAPI.com",
    category: CATEGORIES.docs,
    description: "OverAPI.com is a site collecting all the cheatsheets,all!",
    subtitle: "Collecting all the cheat sheets",
    tags: [TAGS.development, TAGS.education],
    url: "https://overapi.com/",
  },
  {
    title: "Paperless-ngx",
    author: "The Paperless-ngx team",
    category: CATEGORIES.docs,
    description: "Documentation for the Paperless-ngx document management system software.",
    favicon:
      "https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/dev/docs/assets/logo_leaf.svg",
    ogImage:
      "https://opengraph.githubassets.com/e41f9417cd92968ecb63476d01b5e01def7f1a1b63698286415859dd4cd2770f/paperless-ngx/paperless-ngx",
    url: "https://docs.paperless-ngx.com/",
  },
  {
    title: "PDFCraft",
    category: CATEGORIES.docs,
    description:
      "Free, Private & Browser-Based. Merge, edit, and edit PDF files online without uploading to servers.",
    subtitle: "Professional PDF Tools",
    url: "https://pdfcraft.devtoolcafe.com/en/",
  },
  {
    title: "PDF Form Filler",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Fill in any PDF in your browser — add text, checkmarks, dates and hand-drawn signatures. No upload, 100% private, instant PDF export. Free, no signup.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/pdf-form-filler/og-image.png",
    subtitle: "Fill, Sign & Export PDFs Free",
    tags: [TAGS.pdf],
    url: "https://jasperbernaers.com/pdf-form-filler/",
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
    title: "Signature PDF",
    category: CATEGORIES.docs,
    description:
      "Signature PDF is free online software for signing (individually or collaboratively), organizing, or compressing PDF files.",
    favicon: "https://pdf.24eme.fr/logo.svg",
    subtitle: "Sign and manipulate PDFs freely",
    tags: [TAGS.pdf],
    url: "https://pdf.24eme.fr/",
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
  {
    title: "Stirling",
    category: CATEGORIES.docs,
    description:
      "GitHub's #1 PDF application with 30M+ downloads. The next generation of the PDF Editor - private, open-source, and built to scale.",
    favicon:
      "https://raw.githubusercontent.com/Stirling-Tools/Stirling-PDF/main/frontend/editor/src/core/assets/brand/branding-logo/logo-mark.svg",
    ogImage:
      "https://raw.githubusercontent.com/Stirling-Tools/Stirling-PDF/main/frontend/editor/src/core/assets/brand/modern-logo/Firstpage.png",
    subtitle: "PDF Processor",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://stirling.com/",
  },
  {
    title: "Text Cleaner",
    author: "Jasper Bernaers",
    category: CATEGORIES.docs,
    description:
      "Free online text cleaner. Remove extra spaces, line breaks, smart quotes and Word/PDF formatting, strip HTML, remove accents, find & replace, sort, dedup and more — live, in your browser.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/text-cleaner/og-image.png",
    subtitle: "Remove Extra Spaces, Line Breaks & Formatting Online",
    url: "https://jasperbernaers.com/text-cleaner/",
  },
];
