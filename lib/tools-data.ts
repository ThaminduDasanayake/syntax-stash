import { Tool } from "@/types";

export const CATEGORIES = {
  data: "Data & APIs",
  design: "Design & UX",
  dev: "Developer Tools & Utilities",
  education: "Education & Community",
  frontend: "Frontend & UI",
  media: "Media & Assets",
} as const;

export type ToolCategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const toolCategories: ToolCategoryValue[] = Object.values(CATEGORIES);

export const dataTools: Tool[] = [
  {
    title: "curl Command Builder",
    category: CATEGORIES.data,
    description:
      "Build curl commands from a form, or paste a curl command to parse it into a visual breakdown.",
    highlight: "Builder",
    icon: "terminal-window",
    slug: "curl-builder",
  },
  {
    title: "Encoder / Decoder",
    category: CATEGORIES.data,
    description: "Convert strings between Base64, URL-encoded, and Hex encoding.",
    highlight: "Decoder",
    icon: "shield-checkered",
    slug: "encoder-decoder",
  },
  {
    title: "Hash Generator",
    category: CATEGORIES.data,
    description:
      "SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API.",
    highlight: "Generator",
    icon: "fingerprint",
    slug: "hash-generator",
  },
  {
    title: "JSON / CSV Converter",
    category: CATEGORIES.data,
    description:
      "Convert JSON arrays to CSV and back. Supports nested key flattening, custom delimiters, and RFC 4180 quoted fields.",
    highlight: "Converter",
    icon: "file-csv",
    slug: "json-csv-converter",
  },
  {
    title: "JSON Schema Studio",
    category: CATEGORIES.data,
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    highlight: "Studio",
    icon: "brackets-curly",
    slug: "json-schema-studio",
  },
  {
    title: "JSON Studio",
    category: CATEGORIES.data,
    description: "Format, browse, query, and organize JSON — all in one place.",
    highlight: "Studio",
    icon: "brackets-curly",
    slug: "json-studio",
  },
  {
    title: "JWT Decoder",
    category: CATEGORIES.data,
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    highlight: "Decoder",
    icon: "key",
    slug: "jwt-decoder",
  },
  {
    title: "Mock Data Generator",
    category: CATEGORIES.data,
    description: "Generate structured dummy JSON data for testing.",
    highlight: "Generator",
    icon: "database",
    slug: "mock-data-generator",
  },
  {
    title: "Mongo Aggregation Pipeline Builder",
    category: CATEGORIES.data,
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    highlight: "Builder",
    icon: "database",
    slug: "mongo-pipeline-builder",
  },
  {
    title: "Universal Decoder",
    category: CATEGORIES.data,
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, ISO date, or Snowflake ID — and decode it instantly.",
    highlight: "Decoder",
    icon: "scan",
    slug: "universal-decoder",
  },
  {
    title: "XML Studio",
    category: CATEGORIES.data,
    description:
      "Format and prettify XML, and bidirectionally convert between XML and JSON with configurable indentation.",
    highlight: "Studio",
    icon: "file-code",
    slug: "xml-studio",
  },
  {
    title: "YAML / JSON Converter",
    category: CATEGORIES.data,
    description:
      "Bidirectionally convert between YAML and JSON with configurable indentation and inline error feedback.",
    highlight: "Converter",
    icon: "file-code",
    slug: "yaml-json-converter",
  },
];

export const designTools: Tool[] = [
  {
    title: "Code Screenshot",
    category: CATEGORIES.design,
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki.",
    highlight: "Screenshot",
    icon: "image",
    slug: "code-screenshot",
  },
  {
    title: "Color Studio",
    category: CATEGORIES.design,
    description:
      "Convert between HEX/RGB/HSL/OKLCH, generate harmonic palettes, and check WCAG contrast — all in one tabbed studio.",
    highlight: "Studio",
    icon: "palette",
    slug: "color-studio",
  },
  {
    title: "CSS Studio",
    category: CATEGORIES.design,
    description:
      "Border-radius, box-shadow, glassmorphism, cubic-bezier, CSS keyframes, and GSAP animations — all in one tabbed studio.",
    highlight: "Studio",
    icon: "file-css",
    slug: "css-studio",
  },
  {
    title: "Mermaid Live Editor",
    category: CATEGORIES.design,
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    highlight: "Live Editor",
    icon: "flow-arrow",
    slug: "mermaid-editor",
  },
];

export const developmentTools: Tool[] = [
  {
    title: ".gitignore Generator",
    category: CATEGORIES.dev,
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    highlight: "Generator",
    icon: "git-branch",
    slug: "gitignore-generator",
  },
  {
    title: "chmod Calculator",
    category: CATEGORIES.dev,
    description:
      "Calculate Unix file permissions with a click-to-toggle grid. Bidirectionally synced across octal, symbolic, and ls formats.",
    highlight: "Calculator",
    icon: "lock",
    slug: "chmod-calculator",
  },
  {
    title: "Code Stash",
    category: CATEGORIES.dev,
    description: "A curated library of developer snippets and configurations.",
    highlight: "Stash",
    icon: "code",
    slug: "code-stash",
  },
  {
    title: "Cron Studio",
    category: CATEGORIES.dev,
    description:
      "Build cron expressions from presets or a field-by-field editor, then translate them to plain English and preview upcoming executions on a timeline.",
    highlight: "Studio",
    icon: "password",
    slug: "cron-studio",
  },
  {
    title: "CSV to Markdown Table",
    category: CATEGORIES.dev,
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    highlight: "Markdown Table",
    icon: "file-csv",
    slug: "csv-to-markdown",
  },
  {
    title: "Diff Viewer",
    category: CATEGORIES.dev,
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    highlight: "Viewer",
    icon: "plus-minus",
    slug: "diff-viewer",
  },
  {
    title: "Docker Compose Studio",
    category: CATEGORIES.dev,
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    highlight: "Studio",
    icon: "shipping-container",
    slug: "docker-compose-studio",
  },
  {
    title: "Document Extractor",
    category: CATEGORIES.dev,
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files.",
    highlight: "Extractor",
    icon: "book-open-text",
    slug: "document-extractor",
  },
  {
    title: "Drizzle Schema Studio",
    category: CATEGORIES.dev,
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    highlight: "Studio",
    icon: "database",
    slug: "drizzle-schema-studio",
  },
  {
    title: "HTTP Security Header Analyzer",
    category: CATEGORIES.dev,
    description:
      "Paste raw HTTP response headers and get an OWASP-graded security scorecard with fix recommendations.",
    highlight: "Analyzer",
    icon: "shield-check",
    slug: "http-security-header-analyzer",
  },
  {
    title: "JSDoc / TSDoc Generator",
    category: CATEGORIES.dev,
    description:
      "Paste a JavaScript or TypeScript function signature and generate JSDoc or TSDoc with @param, @returns, and @throws stubs.",
    highlight: "Generator",
    icon: "files",
    slug: "jsdoc-generator",
  },
  {
    title: "Secret Generator",
    category: CATEGORIES.dev,
    description:
      "Generate cryptographically secure secrets for JWT, API keys, env vars, and more. Presets for Next.js, Laravel, Django, Rails, and others.",
    highlight: "Generator",
    icon: "lock-key",
    slug: "secret-generator",
  },
  {
    title: "SQL Query Formatter",
    category: CATEGORIES.dev,
    description:
      "Prettify and format raw SQL queries with proper indentation and capitalized keywords.",
    highlight: "Formatter",
    icon: "file-sql",
    slug: "sql-formatter",
  },
  {
    title: "Subnet / CIDR Calculator",
    category: CATEGORIES.dev,
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    highlight: "CIDR Calculator",
    icon: "network",
    slug: "subnet-calculator",
  },
  {
    title: "Text Analyzer",
    category: CATEGORIES.dev,
    description: "Count characters, words, bytes, and estimate LLM tokens for any block of text.",
    highlight: "Analyzer",
    icon: "file-txt",
    slug: "text-analyzer",
  },
  {
    title: "URL Parser & Builder",
    category: CATEGORIES.dev,
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    highlight: "Parser & Builder",
    icon: "link",
    slug: "url-parser",
  },
  {
    title: "UUID Generator",
    category: CATEGORIES.dev,
    description:
      "Generate v4 (random) and v7 (time-ordered) UUIDs in bulk, with uppercase and no-hyphens formatting options.",
    highlight: "Generator",
    icon: "identification-card",
    slug: "uuid-generator",
  },
  {
    title: "Web Extractor",
    category: CATEGORIES.dev,
    description: "Extract meta tags, headings, and links from any public URL.",
    highlight: "Extractor",
    icon: "globe",
    slug: "web-extractor",
  },
];

export const educationTools: Tool[] = [
  {
    title: "Git Command Cheatsheet",
    category: CATEGORIES.education,
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    highlight: "Cheatsheet",
    icon: "git-branch",
    slug: "git-cheatsheet",
  },
  {
    title: "HTTP Status Reference",
    category: CATEGORIES.education,
    description: "Every standard HTTP status code with descriptions and real-world use cases.",
    highlight: "Reference",
    icon: "globe-hemisphere-east",
    slug: "http-status",
  },
];

export const frontendTools: Tool[] = [
  {
    title: "CSS to Tailwind",
    category: CATEGORIES.frontend,
    description:
      "Paste CSS rules and get the equivalent Tailwind utility classes instantly. Supports spacing, colors, typography, and layout.",
    highlight: "Tailwind",
    icon: "shuffle",
    slug: "css-to-tailwind",
  },
  {
    title: "HTML to JSX",
    category: CATEGORIES.frontend,
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    highlight: "JSX",
    icon: "file-jsx",
    slug: "html-to-jsx",
  },
  {
    title: "Regex Studio",
    category: CATEGORIES.frontend,
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    highlight: "Studio",
    icon: "asterisk",
    slug: "regex-studio",
  },
  {
    title: "String Case Converter",
    category: CATEGORIES.frontend,
    description: "Convert text between different naming conventions and typographical styles.",
    highlight: "Converter",
    icon: "text-t",
    slug: "string-case-converter",
  },
  {
    title: "Tailwind Studio",
    category: CATEGORIES.frontend,
    description:
      "Search Tailwind utilities, extract JSX classes into @apply CSS, and generate 50–950 color scales — all in one tabbed studio.",
    highlight: "Studio",
    icon: "swatches",
    slug: "tailwind-studio",
  },
];

export const mediaTools: Tool[] = [
  {
    title: "Image Converter",
    category: CATEGORIES.media,
    description: "Batch convert, resize, and process images natively in your browser.",
    highlight: "Converter",
    icon: "image",
    slug: "image-converter",
  },
  {
    title: "QR Generator",
    category: CATEGORIES.media,
    description: "Generate downloadable QR codes instantly — works entirely in your browser..",
    highlight: "Generator",
    icon: "qr-code",
    slug: "qr-generator",
  },
];

// Internal Tools
export const internalTools: Tool[] = [
  ...dataTools,
  ...designTools,
  ...developmentTools,
  ...educationTools,
  ...frontendTools,
  ...mediaTools,
];
