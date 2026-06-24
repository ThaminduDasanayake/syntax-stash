import { Tool } from "@/types";

export const CATEGORIES = {
  calculators: "Calculators",
  data: "Data & Formats",
  development: "Development & Code",
  devops: "DevOps",
  imagesAssets: "Images & Assets",
  network: "Network & Security",
  schemas: "Schema & Database",
  typography: "Typography & Text",
  uiStyling: "UI & Styling",
} as const;

export type ToolCategoryValue = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const toolCategories: ToolCategoryValue[] = Object.values(CATEGORIES);

export const calculatorTools: Tool[] = [
  {
    category: CATEGORIES.calculators,
    description:
      "Convert between units of length, weight, data, temperature, speed, area and volume.",
    highlight: "Converter",
    icon: "scales",
    slug: "unit-converter",
    tags: ["math", "conversion", "units", "metrics"],
    title: "Unit Converter",
  },
  {
    category: CATEGORIES.calculators,
    description:
      "Convert Unix timestamps, ISO dates, and local time. Timezone viewer and date arithmetic.",
    highlight: "Calculator",
    icon: "clock",
    slug: "time-calculator",
    tags: ["time", "date", "timezone", "timestamp"],
    title: "Time Calculator",
  },
  {
    category: CATEGORIES.calculators,
    description:
      "Convert between decimal, hex, binary, and octal with a 16-bit toggle grid and bitwise ops.",
    highlight: "Converter",
    icon: "binary",
    slug: "base-converter",
    tags: ["hex", "binary", "decimal", "bitwise"],
    title: "Base Converter",
  },
];

export const dataTools: Tool[] = [
  {
    category: CATEGORIES.data,
    description: "Decode and preview base64-encoded images directly in your browser.",
    highlight: "Decoder",
    icon: "file-image",
    slug: "base64-image-decoder",
    title: "Base64 Image Decoder",
  },
  {
    category: CATEGORIES.data,
    description: "Convert strings between Base64, URL-encoded, and Hex encoding.",
    highlight: "Decoder",
    icon: "shield-checkered",
    slug: "encoder-decoder",
    title: "Encoder / Decoder",
  },
  {
    category: CATEGORIES.data,
    description:
      "SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API.",
    highlight: "Generator",
    icon: "fingerprint",
    slug: "hash-generator",
    title: "Hash Generator",
  },
  {
    category: CATEGORIES.data,
    description:
      "Convert JSON arrays to CSV and back. Supports nested key flattening, custom delimiters, and RFC 4180 quoted fields.",
    highlight: "Converter",
    icon: "file-csv",
    slug: "json-csv-converter",
    title: "JSON / CSV Converter",
  },
  {
    category: CATEGORIES.data,
    description: "Format, browse, query, and organize JSON — all in one place.",
    highlight: "Studio",
    icon: "brackets-curly",
    slug: "json-studio",
    title: "JSON Studio",
  },
  {
    category: CATEGORIES.data,
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    highlight: "Decoder",
    icon: "key",
    slug: "jwt-decoder",
    title: "JWT Decoder",
  },
  {
    category: CATEGORIES.data,
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, ISO date, or Snowflake ID — and decode it instantly.",
    highlight: "Decoder",
    icon: "scan",
    slug: "universal-decoder",
    title: "Universal Decoder",
  },
  {
    category: CATEGORIES.data,
    description:
      "Bidirectionally convert between YAML and JSON with configurable indentation and inline error feedback.",
    highlight: "Converter",
    icon: "file-code",
    slug: "yaml-json-converter",
    title: "YAML / JSON Converter",
  },
  {
    category: CATEGORIES.data,
    description:
      "Format and prettify XML, and bidirectionally convert between XML and JSON with configurable indentation.",
    highlight: "Studio",
    icon: "file-code",
    slug: "xml-studio",
    title: "XML Studio",
  },
  {
    category: CATEGORIES.data,
    description:
      "Sign JSON Web Tokens locally in your browser using HS256, HS384, or HS512. Pairs with JWT Decoder.",
    highlight: "Generator",
    icon: "seal",
    slug: "jwt-generator",
    title: "JWT Generator",
  },
];

export const developmentTools: Tool[] = [
  {
    category: CATEGORIES.development,
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki.",
    highlight: "Screenshot",
    icon: "image",
    slug: "code-screenshot",
    title: "Code Screenshot",
  },
  {
    category: CATEGORIES.development,
    description: "A curated library of developer snippets and configurations.",
    highlight: "Stash",
    icon: "code",
    slug: "code-stash",
    title: "Code Stash",
  },
  {
    category: CATEGORIES.development,
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    highlight: "Viewer",
    icon: "plus-minus",
    slug: "diff-viewer",
    title: "Diff Viewer",
  },
  {
    category: CATEGORIES.development,
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    highlight: "Generator",
    icon: "git-branch",
    slug: "gitignore-generator",
    title: ".gitignore Generator",
  },
  {
    category: CATEGORIES.development,
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    highlight: "JSX",
    icon: "file-jsx",
    slug: "html-to-jsx",
    title: "HTML to JSX",
  },
  {
    category: CATEGORIES.development,
    description:
      "Paste a JavaScript or TypeScript function signature and generate JSDoc or TSDoc with @param, @returns, and @throws stubs.",
    highlight: "Generator",
    icon: "files",
    slug: "jsdoc-generator",
    title: "JSDoc / TSDoc Generator",
  },
  {
    category: CATEGORIES.development,
    description:
      "Write markdown with a real-time side-by-side preview. Supports GFM tables, task lists, and more.",
    highlight: "Preview",
    icon: "markdown-logo",
    slug: "markdown-live-preview",
    title: "Markdown Live Preview",
  },
  {
    category: CATEGORIES.development,
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    highlight: "Live Editor",
    icon: "flow-arrow",
    slug: "mermaid-editor",
    title: "Mermaid Live Editor",
  },
  {
    category: CATEGORIES.development,
    description: "Generate structured dummy JSON data for testing.",
    highlight: "Generator",
    icon: "database",
    slug: "mock-data-generator",
    title: "Mock Data Generator",
  },
  {
    category: CATEGORIES.development,
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    highlight: "Studio",
    icon: "asterisk",
    slug: "regex-studio",
    title: "Regex Studio",
  },
  {
    category: CATEGORIES.development,
    description:
      "Generate v4 (random) and v7 (time-ordered) UUIDs in bulk, with uppercase and no-hyphens formatting options.",
    highlight: "Generator",
    icon: "identification-card",
    slug: "uuid-generator",
    title: "UUID Generator",
  },
  {
    category: CATEGORIES.development,
    description: "Extract meta tags, headings, and links from any public URL.",
    highlight: "Extractor",
    icon: "globe",
    slug: "web-extractor",
    title: "Web Extractor",
  },
];

export const devopsTools: Tool[] = [
  {
    category: CATEGORIES.devops,
    description:
      "Calculate Unix file permissions with a click-to-toggle grid. Bidirectionally synced across octal, symbolic, and ls formats.",
    highlight: "Calculator",
    icon: "lock",
    slug: "chmod-calculator",
    title: "chmod Calculator",
  },
  {
    category: CATEGORIES.devops,
    description:
      "Build cron expressions from presets or a field-by-field editor, then translate them to plain English and preview upcoming executions on a timeline.",
    highlight: "Studio",
    icon: "password",
    slug: "cron-studio",
    title: "Cron Studio",
  },
  {
    category: CATEGORIES.devops,
    description:
      "Build curl commands from a form, or paste a curl command to parse it into a visual breakdown.",
    highlight: "Builder",
    icon: "terminal-window",
    slug: "curl-builder",
    title: "curl Command Builder",
  },
  {
    category: CATEGORIES.devops,
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    highlight: "Studio",
    icon: "shipping-container",
    slug: "docker-compose-studio",
    title: "Docker Compose Studio",
  },
  {
    category: CATEGORIES.devops,
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    highlight: "Cheatsheet",
    icon: "git-branch",
    slug: "git-cheatsheet",
    title: "Git Command Cheatsheet",
  },
];

export const imageTools: Tool[] = [
  {
    category: CATEGORIES.imagesAssets,
    description:
      "Generate ASCII banners, folder trees, markdown tables, glitch text, and convert images to ASCII art.",
    highlight: "Studio",
    icon: "terminal-window",
    slug: "ascii-studio",
    title: "ASCII Studio",
  },
  {
    category: CATEGORIES.imagesAssets,
    description:
      "Generate the full favicon set (.ico, apple-touch, PWA icons) and HTML/manifest snippets from any source image. Browser-only.",
    highlight: "Generator",
    icon: "star",
    slug: "favicon-generator",
    title: "Favicon Generator",
  },
  {
    category: CATEGORIES.imagesAssets,
    description: "Batch convert, resize, and process images natively in your browser.",
    highlight: "Converter",
    icon: "image",
    slug: "image-converter",
    title: "Image Converter",
  },
  {
    category: CATEGORIES.imagesAssets,
    description: "Generate downloadable QR codes instantly — works entirely in your browser..",
    highlight: "Generator",
    icon: "qr-code",
    slug: "qr-generator",
    title: "QR Generator",
  },
  {
    category: CATEGORIES.imagesAssets,
    description: "Minify and clean bloated SVG files with multipass optimization..",
    highlight: "Optimizer",
    icon: "file-svg",
    slug: "svg-optimizer",
    title: "SVG Optimizer",
  },
  {
    category: CATEGORIES.imagesAssets,
    description:
      "Preview and edit raw SVG 'd' paths with real-time visualization and customizable styling.",
    highlight: "Editor",
    icon: "file-svg",
    slug: "svg-path",
    title: "SVG Path Viewer Editor",
  },
  {
    category: CATEGORIES.imagesAssets,
    description:
      "Generate custom placeholder images with configurable dimensions, colors, and text. Download as PNG or copy as a data URL.",
    highlight: "Generator",
    icon: "frame-corners",
    slug: "placeholder-generator",
    title: "Placeholder Image Generator",
  },
];

export const networkTools: Tool[] = [
  {
    category: CATEGORIES.network,
    description:
      "Paste raw HTTP response headers and get an OWASP-graded security scorecard with fix recommendations.",
    highlight: "Analyzer",
    icon: "shield-check",
    slug: "http-security-header-analyzer",
    title: "HTTP Security Header Analyzer",
  },
  {
    category: CATEGORIES.network,
    description: "Every standard HTTP status code with descriptions and real-world use cases.",
    highlight: "Reference",
    icon: "globe-hemisphere-east",
    slug: "http-status",
    title: "HTTP Status Reference",
  },
  {
    category: CATEGORIES.network,
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    highlight: "CIDR Calculator",
    icon: "network",
    slug: "subnet-calculator",
    title: "Subnet / CIDR Calculator",
  },
  {
    category: CATEGORIES.network,
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    highlight: "Parser & Builder",
    icon: "link",
    slug: "url-parser",
    title: "URL Parser & Builder",
  },
  {
    category: CATEGORIES.network,
    description:
      "Generate cryptographically secure secrets for JWT, API keys, env vars, and more. Presets for Next.js, Laravel, Django, Rails, and others.",
    highlight: "Generator",
    icon: "lock-key",
    slug: "secret-generator",
    title: "Secret Generator",
  },
  {
    category: CATEGORIES.network,
    description:
      "Generate secure passwords with configurable length, charset toggles, and entropy meter. Includes diceware passphrase mode.",
    highlight: "Generator",
    icon: "shield-plus",
    slug: "password-generator",
    title: "Password Generator",
  },
];

export const schemaTools: Tool[] = [
  {
    category: CATEGORIES.schemas,
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    highlight: "Studio",
    icon: "database",
    slug: "drizzle-schema-studio",
    title: "Drizzle Schema Studio",
  },
  {
    category: CATEGORIES.schemas,
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    highlight: "Studio",
    icon: "brackets-curly",
    slug: "json-schema-studio",
    title: "JSON Schema Studio",
  },
  {
    category: CATEGORIES.schemas,
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    highlight: "Builder",
    icon: "database",
    slug: "mongo-pipeline-builder",
    title: "Mongo Aggregation Pipeline Builder",
  },
  {
    category: CATEGORIES.schemas,
    description:
      "Prettify and format raw SQL queries with proper indentation and capitalized keywords.",
    highlight: "Formatter",
    icon: "file-sql",
    slug: "sql-formatter",
    title: "SQL Query Formatter",
  },
];

export const typographyTools: Tool[] = [
  {
    category: CATEGORIES.typography,
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    highlight: "Markdown Table",
    icon: "file-csv",
    slug: "csv-to-markdown",
    title: "CSV to Markdown Table",
  },
  {
    category: CATEGORIES.typography,
    description:
      "Generate placeholder text by paragraphs, sentences, or words. Choose from classic Latin, hipster, or corporate variants.",
    highlight: "Generator",
    icon: "article",
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
  },
  {
    category: CATEGORIES.typography,
    description: "Convert text between different naming conventions and typographical styles.",
    highlight: "Converter",
    icon: "text-t",
    slug: "string-case-converter",
    title: "String Case Converter",
  },
  {
    category: CATEGORIES.typography,
    description: "Count characters, words, bytes, and estimate LLM tokens for any block of text.",
    highlight: "Analyzer",
    icon: "file-txt",
    slug: "text-analyzer",
    title: "Text Analyzer",
  },
  {
    category: CATEGORIES.typography,
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files.",
    highlight: "Extractor",
    icon: "book-open-text",
    slug: "document-extractor",
    title: "Document Extractor",
  },
];

export const uiStyling: Tool[] = [
  {
    category: CATEGORIES.uiStyling,
    description:
      "Convert between HEX/RGB/HSL/OKLCH, generate harmonic palettes, and check WCAG contrast — all in one tabbed studio.",
    highlight: "Studio",
    icon: "palette",
    slug: "color-studio",
    title: "Color Studio",
  },
  {
    category: CATEGORIES.uiStyling,
    description:
      "Border-radius, box-shadow, glassmorphism, cubic-bezier, CSS keyframes, and GSAP animations — all in one tabbed studio.",
    highlight: "Studio",
    icon: "file-css",
    slug: "css-studio",
    title: "CSS Studio",
  },
  {
    category: CATEGORIES.uiStyling,
    description:
      "Interactively explore Tailwind Flex and Grid layout properties and see the code in real-time.",
    highlight: "Visualizer",
    icon: "layout",
    slug: "layout-visualizer",
    title: "Layout Visualizer",
  },
  {
    category: CATEGORIES.uiStyling,
    description:
      "Search Tailwind utilities, extract JSX classes into @apply CSS, and generate 50–950 color scales — all in one tabbed studio.",
    highlight: "Studio",
    icon: "swatches",
    slug: "tailwind-studio",
    title: "Tailwind Studio",
  },
  {
    category: CATEGORIES.uiStyling,
    description:
      "Paste CSS rules and get the equivalent Tailwind utility classes instantly. Supports spacing, colors, typography, and layout.",
    highlight: "Tailwind",
    icon: "shuffle",
    slug: "css-to-tailwind",
    title: "CSS to Tailwind",
  },
  {
    category: CATEGORIES.uiStyling,
    description:
      "Build linear, radial, and conic gradients with a multi-stop editor. Exports plain CSS and Tailwind arbitrary values.",
    highlight: "Generator",
    icon: "gradient",
    slug: "gradient-generator",
    title: "Gradient Generator",
  },
];

// Internal Tools
export const internalTools: Tool[] = [
  ...calculatorTools,
  ...dataTools,
  ...developmentTools,
  ...devopsTools,
  ...imageTools,
  ...networkTools,
  ...schemaTools,
  ...typographyTools,
  ...uiStyling,
];
