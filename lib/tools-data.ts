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

export const calculatorTools: Tool[] = [
  {
    title: "Unit Converter",
    highlight: "Converter",
    slug: "unit-converter",
    description:
      "Convert between units of length, weight, data, temperature, speed, area and volume.",
    category: CATEGORIES.calculators,
    icon: "scales",
    tags: ["math", "conversion", "units", "metrics"],
  },
  {
    title: "Time Calculator",
    highlight: "Calculator",
    slug: "time-calculator",
    description:
      "Convert Unix timestamps, ISO dates, and local time. Timezone viewer and date arithmetic.",
    category: CATEGORIES.calculators,
    icon: "clock",
    tags: ["time", "date", "timezone", "timestamp"],
  },
  {
    title: "Base Converter",
    highlight: "Converter",
    slug: "base-converter",
    description:
      "Convert between decimal, hex, binary, and octal with a 16-bit toggle grid and bitwise ops.",
    category: CATEGORIES.calculators,
    icon: "binary",
    tags: ["hex", "binary", "decimal", "bitwise"],
  },
];

export const dataTools: Tool[] = [
  {
    title: "Base64 Image Decoder",
    highlight: "Decoder",
    slug: "base64-image-decoder",
    description: "Decode and preview base64-encoded images directly in your browser.",
    category: CATEGORIES.data,
    icon: "file-image",
  },
  {
    title: "Encoder / Decoder",
    highlight: "Decoder",
    slug: "encoder-decoder",
    description: "Convert strings between Base64, URL-encoded, and Hex encoding.",
    category: CATEGORIES.data,
    icon: "shield-checkered",
  },
  {
    title: "Hash Generator",
    highlight: "Generator",
    slug: "hash-generator",
    description:
      "SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API.",
    category: CATEGORIES.data,
    icon: "fingerprint",
  },
  {
    title: "JSON / CSV Converter",
    highlight: "Converter",
    slug: "json-csv-converter",
    description:
      "Convert JSON arrays to CSV and back. Supports nested key flattening, custom delimiters, and RFC 4180 quoted fields.",
    category: CATEGORIES.data,
    icon: "file-csv",
  },
  {
    title: "JSON Studio",
    highlight: "Studio",
    slug: "json-studio",
    description: "Format, browse, query, and organize JSON — all in one place.",
    category: CATEGORIES.data,
    icon: "brackets-curly",
  },
  {
    title: "JWT Decoder",
    highlight: "Decoder",
    slug: "jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: CATEGORIES.data,
    icon: "key",
  },
  {
    title: "Universal Decoder",
    highlight: "Decoder",
    slug: "universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, ISO date, or Snowflake ID — and decode it instantly.",
    category: CATEGORIES.data,
    icon: "scan",
  },
  {
    title: "YAML / JSON Converter",
    highlight: "Converter",
    slug: "yaml-json-converter",
    description:
      "Bidirectionally convert between YAML and JSON with configurable indentation and inline error feedback.",
    category: CATEGORIES.data,
    icon: "file-code",
  },
  {
    title: "XML Studio",
    highlight: "Studio",
    slug: "xml-studio",
    description:
      "Format and prettify XML, and bidirectionally convert between XML and JSON with configurable indentation.",
    category: CATEGORIES.data,
    icon: "file-code",
  },
  {
    title: "JWT Generator",
    highlight: "Generator",
    slug: "jwt-generator",
    description:
      "Sign JSON Web Tokens locally in your browser using HS256, HS384, or HS512. Pairs with JWT Decoder.",
    category: CATEGORIES.data,
    icon: "seal",
  },
];

export const developmentTools: Tool[] = [
  {
    title: "Code Screenshot",
    highlight: "Screenshot",
    slug: "code-screenshot",
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki.",
    category: CATEGORIES.development,
    icon: "image",
  },
  {
    title: "Code Stash",
    highlight: "Stash",
    slug: "code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: CATEGORIES.development,
    icon: "code",
  },
  {
    title: "Diff Viewer",
    highlight: "Viewer",
    slug: "diff-viewer",
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    category: CATEGORIES.development,
    icon: "plus-minus",
  },
  {
    title: ".gitignore Generator",
    highlight: "Generator",
    slug: "gitignore-generator",
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    category: CATEGORIES.development,
    icon: "git-branch",
  },
  {
    title: "HTML to JSX",
    highlight: "JSX",
    slug: "html-to-jsx",
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    category: CATEGORIES.development,
    icon: "file-jsx",
  },
  {
    title: "JSDoc / TSDoc Generator",
    highlight: "Generator",
    slug: "jsdoc-generator",
    description:
      "Paste a JavaScript or TypeScript function signature and generate JSDoc or TSDoc with @param, @returns, and @throws stubs.",
    category: CATEGORIES.development,
    icon: "files",
  },
  {
    title: "Markdown Live Preview",
    highlight: "Preview",
    slug: "markdown-live-preview",
    description:
      "Write markdown with a real-time side-by-side preview. Supports GFM tables, task lists, and more.",
    category: CATEGORIES.development,
    icon: "markdown-logo",
  },
  {
    title: "Mermaid Live Editor",
    highlight: "Live Editor",
    slug: "mermaid-editor",
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    category: CATEGORIES.development,
    icon: "flow-arrow",
  },
  {
    title: "Mock Data Generator",
    highlight: "Generator",
    slug: "mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: CATEGORIES.development,
    icon: "database",
  },
  {
    title: "Regex Studio",
    highlight: "Studio",
    slug: "regex-studio",
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    category: CATEGORIES.development,
    icon: "asterisk",
  },
  {
    title: "UUID Generator",
    highlight: "Generator",
    slug: "uuid-generator",
    description:
      "Generate v4 (random) and v7 (time-ordered) UUIDs in bulk, with uppercase and no-hyphens formatting options.",
    category: CATEGORIES.development,
    icon: "identification-card",
  },
  {
    title: "Web Extractor",
    highlight: "Extractor",
    slug: "web-extractor",
    description: "Extract meta tags, headings, and links from any public URL.",
    category: CATEGORIES.development,
    icon: "globe",
  },
];

export const devopsTools: Tool[] = [
  {
    title: "chmod Calculator",
    highlight: "Calculator",
    slug: "chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid. Bidirectionally synced across octal, symbolic, and ls formats.",
    category: CATEGORIES.devops,
    icon: "lock",
  },
  {
    title: "Cron Studio",
    highlight: "Studio",
    slug: "cron-studio",
    description:
      "Build cron expressions from presets or a field-by-field editor, then translate them to plain English and preview upcoming executions on a timeline.",
    category: CATEGORIES.devops,
    icon: "password",
  },
  {
    title: "curl Command Builder",
    highlight: "Builder",
    slug: "curl-builder",
    description:
      "Build curl commands from a form, or paste a curl command to parse it into a visual breakdown.",
    category: CATEGORIES.devops,
    icon: "terminal-window",
  },
  {
    title: "Docker Compose Studio",
    highlight: "Studio",
    slug: "docker-compose-studio",
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    category: CATEGORIES.devops,
    icon: "shipping-container",
  },
  {
    title: "Git Command Cheatsheet",
    highlight: "Cheatsheet",
    slug: "git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: CATEGORIES.devops,
    icon: "git-branch",
  },
];

export const imageTools: Tool[] = [
  {
    title: "ASCII Studio",
    highlight: "Studio",
    slug: "ascii-studio",
    description:
      "Generate ASCII banners, folder trees, markdown tables, glitch text, and convert images to ASCII art.",
    category: CATEGORIES.imagesAssets,
    icon: "terminal-window",
  },
  {
    title: "Favicon Generator",
    highlight: "Generator",
    slug: "favicon-generator",
    description:
      "Generate the full favicon set (.ico, apple-touch, PWA icons) and HTML/manifest snippets from any source image. Browser-only.",
    category: CATEGORIES.imagesAssets,
    icon: "star",
  },
  {
    title: "Image Converter",
    highlight: "Converter",
    slug: "image-converter",
    description: "Batch convert, resize, and process images natively in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: "image",
  },
  {
    title: "QR Generator",
    highlight: "Generator",
    slug: "qr-generator",
    description: "Generate downloadable QR codes instantly — works entirely in your browser..",
    category: CATEGORIES.imagesAssets,
    icon: "qr-code",
  },
  {
    title: "SVG Optimizer",
    highlight: "Optimizer",
    slug: "svg-optimizer",
    description: "Minify and clean bloated SVG files with multipass optimization..",
    category: CATEGORIES.imagesAssets,
    icon: "file-svg",
  },
  {
    title: "SVG Path Viewer Editor",
    highlight: "Editor",
    slug: "svg-path",
    description:
      "Preview and edit raw SVG 'd' paths with real-time visualization and customizable styling.",
    category: CATEGORIES.imagesAssets,
    icon: "file-svg",
  },
  {
    title: "Placeholder Image Generator",
    highlight: "Generator",
    slug: "placeholder-generator",
    description:
      "Generate custom placeholder images with configurable dimensions, colors, and text. Download as PNG or copy as a data URL.",
    category: CATEGORIES.imagesAssets,
    icon: "frame-corners",
  },
];

export const networkTools: Tool[] = [
  {
    title: "HTTP Security Header Analyzer",
    highlight: "Analyzer",
    slug: "http-security-header-analyzer",
    description:
      "Paste raw HTTP response headers and get an OWASP-graded security scorecard with fix recommendations.",
    category: CATEGORIES.network,
    icon: "shield-check",
  },
  {
    title: "HTTP Status Reference",
    highlight: "Reference",
    slug: "http-status",
    description: "Every standard HTTP status code with descriptions and real-world use cases.",
    category: CATEGORIES.network,
    icon: "globe-hemisphere-east",
  },
  {
    title: "Subnet / CIDR Calculator",
    highlight: "CIDR Calculator",
    slug: "subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: CATEGORIES.network,
    icon: "network",
  },
  {
    title: "URL Parser & Builder",
    highlight: "Parser & Builder",
    slug: "url-parser",
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    category: CATEGORIES.network,
    icon: "link",
  },
  {
    title: "Secret Generator",
    highlight: "Generator",
    slug: "secret-generator",
    description:
      "Generate cryptographically secure secrets for JWT, API keys, env vars, and more. Presets for Next.js, Laravel, Django, Rails, and others.",
    category: CATEGORIES.network,
    icon: "lock-key",
  },
  {
    title: "Password Generator",
    highlight: "Generator",
    slug: "password-generator",
    description:
      "Generate secure passwords with configurable length, charset toggles, and entropy meter. Includes diceware passphrase mode.",
    category: CATEGORIES.network,
    icon: "shield-plus",
  },
];

export const schemaTools: Tool[] = [
  {
    title: "Drizzle Schema Studio",
    highlight: "Studio",
    slug: "drizzle-schema-studio",
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    category: CATEGORIES.schemas,
    icon: "database",
  },
  {
    title: "JSON Schema Studio",
    highlight: "Studio",
    slug: "json-schema-studio",
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    category: CATEGORIES.schemas,
    icon: "brackets-curly",
  },
  {
    title: "Mongo Aggregation Pipeline Builder",
    highlight: "Builder",
    slug: "mongo-pipeline-builder",
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    category: CATEGORIES.schemas,
    icon: "database",
  },
  {
    title: "SQL Query Formatter",
    highlight: "Formatter",
    slug: "sql-formatter",
    description:
      "Prettify and format raw SQL queries with proper indentation and capitalized keywords.",
    category: CATEGORIES.schemas,
    icon: "file-sql",
  },
];

export const typographyTools: Tool[] = [
  {
    title: "CSV to Markdown Table",
    highlight: "Markdown Table",
    slug: "csv-to-markdown",
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    category: CATEGORIES.typography,
    icon: "file-csv",
  },
  {
    title: "Lorem Ipsum Generator",
    highlight: "Generator",
    slug: "lorem-ipsum-generator",
    description:
      "Generate placeholder text by paragraphs, sentences, or words. Choose from classic Latin, hipster, or corporate variants.",
    category: CATEGORIES.typography,
    icon: "article",
  },
  {
    title: "String Case Converter",
    highlight: "Converter",
    slug: "string-case-converter",
    description: "Convert text between different naming conventions and typographical styles.",
    category: CATEGORIES.typography,
    icon: "text-t",
  },
  {
    title: "Text Analyzer",
    highlight: "Analyzer",
    slug: "text-analyzer",
    description: "Count characters, words, bytes, and estimate LLM tokens for any block of text.",
    category: CATEGORIES.typography,
    icon: "file-txt",
  },
  {
    title: "Document Extractor",
    highlight: "Extractor",
    slug: "document-extractor",
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files.",
    category: CATEGORIES.typography,
    icon: "book-open-text",
  },
];

export const uiStyling: Tool[] = [
  {
    title: "Color Studio",
    highlight: "Studio",
    slug: "color-studio",
    description:
      "Convert between HEX/RGB/HSL/OKLCH, generate harmonic palettes, and check WCAG contrast — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: "palette",
  },
  {
    title: "CSS Studio",
    highlight: "Studio",
    slug: "css-studio",
    description:
      "Border-radius, box-shadow, glassmorphism, cubic-bezier, CSS keyframes, and GSAP animations — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: "file-css",
  },
  {
    title: "Layout Visualizer",
    highlight: "Visualizer",
    slug: "layout-visualizer",
    description:
      "Interactively explore Tailwind Flex and Grid layout properties and see the code in real-time.",
    category: CATEGORIES.uiStyling,
    icon: "layout",
  },
  {
    title: "Tailwind Studio",
    highlight: "Studio",
    slug: "tailwind-studio",
    description:
      "Search Tailwind utilities, extract JSX classes into @apply CSS, and generate 50–950 color scales — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: "swatches",
  },
  {
    title: "CSS to Tailwind",
    highlight: "Tailwind",
    slug: "css-to-tailwind",
    description:
      "Paste CSS rules and get the equivalent Tailwind utility classes instantly. Supports spacing, colors, typography, and layout.",
    category: CATEGORIES.uiStyling,
    icon: "shuffle",
  },
  {
    title: "Gradient Generator",
    highlight: "Generator",
    slug: "gradient-generator",
    description:
      "Build linear, radial, and conic gradients with a multi-stop editor. Exports plain CSS and Tailwind arbitrary values.",
    category: CATEGORIES.uiStyling,
    icon: "gradient",
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
