import {
  ArrowsClockwiseIcon,
  AsteriskIcon,
  BinaryIcon,
  BookOpenTextIcon,
  BracketsCurlyIcon,
  CardsIcon,
  CircuitryIcon,
  ClockIcon,
  CodeIcon,
  CubeIcon,
  DatabaseIcon,
  EyedropperIcon,
  EyeIcon,
  FileCssIcon,
  FileCsvIcon,
  FileImageIcon,
  FileJsxIcon,
  FileMdIcon,
  FilesIcon,
  FileSqlIcon,
  FileSvgIcon,
  FileTxtIcon,
  FingerprintIcon,
  FlaskIcon,
  GitBranchIcon,
  GlobeHemisphereEastIcon,
  GlobeIcon,
  GridNineIcon,
  ImageIcon,
  KeyIcon,
  LayoutIcon,
  LinkIcon,
  LockIcon,
  MagicWandIcon,
  MarkdownLogoIcon,
  NetworkIcon,
  PaletteIcon,
  PasswordIcon,
  PlaceholderIcon,
  PlayIcon,
  PlusMinusIcon,
  QrCodeIcon,
  RssIcon,
  ScalesIcon,
  ScanIcon,
  ScissorsIcon,
  ShieldCheckeredIcon,
  ShieldCheckIcon,
  ShippingContainerIcon,
  SquareIcon,
  SwatchesIcon,
  TerminalWindowIcon,
  TextTIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react/ssr";

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
    url: "/tools/unit-converter",
    description:
      "Convert between units of length, weight, data, temperature, speed, area and volume.",
    category: CATEGORIES.calculators,
    icon: ScalesIcon,
  },
  {
    title: "Time Calculator",
    url: "/tools/time-calculator",
    description:
      "Convert Unix timestamps, ISO dates, and local time. Timezone viewer and date arithmetic.",
    category: CATEGORIES.calculators,
    icon: ClockIcon,
  },
  {
    title: "Base Converter",
    url: "/tools/base-converter",
    description:
      "Convert between decimal, hex, binary, and octal with a 16-bit toggle grid and bitwise ops.",
    category: CATEGORIES.calculators,
    icon: BinaryIcon,
  },
];

export const dataTools: Tool[] = [
  {
    title: "Base64 Image Decoder",
    url: "/tools/base64-image-decoder",
    description: "Decode and preview base64-encoded images locally.",
    category: CATEGORIES.data,
    icon: FileImageIcon,
  },
  {
    title: "Encoder / Decoder",
    url: "/tools/encoder-decoder",
    description: "Convert strings between Base64, URL, and Hex encoding.",
    category: CATEGORIES.data,
    icon: ShieldCheckeredIcon,
  },
  {
    title: "Hash Generator",
    url: "/tools/hash-generator",
    description: "Generate secure cryptographic hashes locally.",
    category: CATEGORIES.data,
    icon: FingerprintIcon,
  },
  {
    title: "JSON Studio",
    url: "/tools/json-studio",
    description: "Format, browse, query, and organize JSON — all in one place.",
    category: CATEGORIES.data,
    icon: BracketsCurlyIcon,
  },
  {
    title: "JWT Decoder",
    url: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: CATEGORIES.data,
    icon: KeyIcon,
  },
  {
    title: "Universal Decoder",
    url: "/tools/universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, or Snowflake ID — and decode it instantly.",
    category: CATEGORIES.data,
    icon: ScanIcon,
  },
];

export const developmentTools: Tool[] = [
  {
    title: "AI Prompt Studio",
    highlight: "Studio",
    url: "/tools/prompt-studio",
    description:
      "Write, inject variables, minify, and enhance LLM prompts with real-time token tracking.",
    category: CATEGORIES.development,
    icon: FlaskIcon,
  },
  {
    title: "Code Screenshot",
    highlight: "Screenshot",
    url: "/tools/code-screenshot",
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki.",
    category: CATEGORIES.development,
    icon: ImageIcon,
  },
  {
    title: "Code Stash",
    highlight: "Stash",
    url: "/tools/code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: CATEGORIES.development,
    icon: CodeIcon,
  },
  {
    title: "Diff Viewer",
    highlight: "Viewer",
    url: "/tools/diff-viewer",
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    category: CATEGORIES.development,
    icon: PlusMinusIcon,
  },
  {
    title: "HTML to JSX",
    url: "/tools/html-to-jsx",
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    category: CATEGORIES.development,
    icon: FileJsxIcon,
  },
  {
    title: ".gitignore Generator",
    url: "/tools/gitignore-generator",
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    category: CATEGORIES.development,
    icon: GitBranchIcon,
  },
  {
    title: "JSDoc / TSDoc Generator",
    url: "/tools/jsdoc-generator",
    description:
      "Paste a TypeScript function signature and generate JSDoc or TSDoc with @param and @returns stubs.",
    category: CATEGORIES.development,
    icon: FilesIcon,
  },
  {
    title: "Markdown Live Preview",
    url: "/tools/markdown-live-preview",
    description:
      "Write markdown with a side-by-side preview, view the generated HTML, and export to .md or .html.",
    category: CATEGORIES.development,
    icon: MarkdownLogoIcon,
  },
  {
    title: "Markdown Table of Contents",
    url: "/tools/markdown-toc-generator",
    description:
      "Generate a nested Table of Contents from your Markdown document with automatic anchor links.",
    category: CATEGORIES.development,
    icon: FileMdIcon,
  },
  {
    title: "Mermaid Live Editor",
    url: "/tools/mermaid-editor",
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    category: CATEGORIES.development,
    icon: TreeStructureIcon,
  },
  {
    title: "Mock Data Generator",
    url: "/tools/mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: CATEGORIES.development,
    icon: DatabaseIcon,
  },
  {
    title: "NLP Sandbox",
    url: "/tools/nlp-sandbox",
    description: "Simulate text cleaning, vectorization, and scaling pipelines with live output.",
    category: CATEGORIES.development,
    icon: CircuitryIcon,
  },
  {
    title: "Regex Studio",
    url: "/tools/regex-studio",
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    category: CATEGORIES.development,
    icon: AsteriskIcon,
  },
  {
    title: "Web Extractor",
    url: "/tools/web-extractor",
    description: "Extract meta tags, headings, and links from any public URL.",
    category: CATEGORIES.development,
    icon: GlobeIcon,
  },
];

export const devopsTools: Tool[] = [
  {
    title: "chmod Calculator",
    url: "/tools/chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid, synced across octal and symbolic formats.",
    category: CATEGORIES.devops,
    icon: LockIcon,
  },
  {
    title: "Cron Explorer",
    url: "/tools/cron-explorer",
    description:
      "Translate cron expressions to plain English, and visualize upcoming executions on a timeline.",
    category: CATEGORIES.devops,
    icon: PasswordIcon,
  },
  {
    title: "curl Command Builder",
    url: "/tools/curl-builder",
    description:
      "Build curl commands from a form, or paste a curl command to parse it into structured fields.",
    category: CATEGORIES.devops,
    icon: TerminalWindowIcon,
  },
  {
    title: "Docker Compose Studio",
    url: "/tools/docker-compose",
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    category: CATEGORIES.devops,
    icon: ShippingContainerIcon,
  },
  {
    title: "Git Command Cheatsheet",
    url: "/tools/git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: CATEGORIES.devops,
    icon: GitBranchIcon,
  },
];

export const imageTools: Tool[] = [
  {
    title: "ASCII Diagram Editor",
    url: "/tools/ascii-diagram",
    description:
      "Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters.",
    category: CATEGORIES.imagesAssets,
    icon: GridNineIcon,
  },
  {
    title: "Image Converter",
    url: "/tools/image-converter",
    description: "Batch convert, resize, and process images natively in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: ImageIcon,
  },
  {
    title: "Placeholder Generator",
    url: "/tools/placeholder-generator",
    description:
      "Generate custom placeholder images with the Canvas API, entirely in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: PlaceholderIcon,
  },
  {
    title: "QR Generator",
    url: "/tools/qr-generator",
    description: "Generate downloadable QR codes instantly.",
    category: CATEGORIES.imagesAssets,
    icon: QrCodeIcon,
  },
  {
    title: "SVG Optimizer",
    url: "/tools/svg-optimizer",
    description: "Minify and clean bloated SVG files.",
    category: CATEGORIES.imagesAssets,
    icon: FileSvgIcon,
  },
  {
    title: "SVG Path Viewer",
    url: "/tools/svg-path",
    description: "Preview and edit SVG 'd' paths with real-time visualization.",
    category: CATEGORIES.imagesAssets,
    icon: FileSvgIcon,
  },
];

export const networkTools: Tool[] = [
  {
    title: "HTTP Security Header Analyzer",
    url: "/tools/header-analyzer",
    description:
      "Grade your HTTP response headers against OWASP best practices and generate a Next.js config.",
    category: CATEGORIES.network,
    icon: ShieldCheckIcon,
  },
  {
    title: "HTTP Status Reference",
    url: "/tools/http-status",
    description:
      "Every standard HTTP status code with descriptions, use cases, and category colour-coding.",
    category: CATEGORIES.network,
    icon: GlobeHemisphereEastIcon,
  },
  {
    title: "MAC Address Vendor Lookup",
    url: "/tools/mac-vendor-lookup",
    description: "Look up MAC address vendors by OUI with support for multiple formats.",
    category: CATEGORIES.network,
    icon: RssIcon,
  },
  {
    title: "Open Graph Previewer",
    url: "/tools/og-preview",
    description: "Preview how your link card will appear when shared on Twitter/X and LinkedIn.",
    category: CATEGORIES.network,
    icon: GlobeIcon,
  },
  {
    title: "Subnet / CIDR Calculator",
    url: "/tools/subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: CATEGORIES.network,
    icon: NetworkIcon,
  },
  {
    title: "URL Parser & Builder",
    url: "/tools/url-parser",
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    category: CATEGORIES.network,
    icon: LinkIcon,
  },
];

export const schemaTools: Tool[] = [
  {
    title: "Drizzle Schema Studio",
    url: "/tools/drizzle-schema-studio",
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    category: CATEGORIES.schemas,
    icon: DatabaseIcon,
  },
  {
    title: "JSON Schema Studio",
    url: "/tools/json-schema-studio",
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    category: CATEGORIES.schemas,
    icon: BracketsCurlyIcon,
  },
  {
    title: "Mongo Aggregation Builder",
    url: "/tools/mongo-pipeline-builder",
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    category: CATEGORIES.schemas,
    icon: DatabaseIcon,
  },
  {
    title: "SQL Formatter",
    url: "/tools/sql-formatter",
    description: "Prettify raw SQL queries with proper indentation and capitalized keywords.",
    category: CATEGORIES.schemas,
    icon: FileSqlIcon,
  },
];

export const typographyTools: Tool[] = [
  {
    title: "CSV to Markdown Table",
    url: "/tools/csv-to-markdown",
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    category: CATEGORIES.typography,
    icon: FileCsvIcon,
  },
  {
    title: "String Case Converter",
    url: "/tools/string-case-converter",
    description: "Convert text between different naming conventions and typographical styles.",
    category: CATEGORIES.typography,
    icon: TextTIcon,
  },
  {
    title: "Text Analyzer",
    url: "/tools/text-analyzer",
    description: "Analyze text for word counts, bytes, and estimated LLM tokens.",
    category: CATEGORIES.typography,
    icon: FileTxtIcon,
  },
  {
    title: "Document Extractor",
    url: "/tools/document-extractor",
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files. Optional rich editor, YAML frontmatter, and .md download.",
    category: CATEGORIES.typography,
    icon: BookOpenTextIcon,
  },
];

export const uiStyling: Tool[] = [
  {
    title: "Border Radius Previewer",
    url: "/tools/border-radius",
    description:
      "Visually configure CSS border-radius with per-corner sliders, presets, and live shape preview.",
    category: CATEGORIES.uiStyling,
    icon: SquareIcon,
  },
  {
    title: "Color Palette Generator",
    url: "/tools/color-palette-generator",
    description:
      "Generate complementary, analogous, triadic, and monochromatic palettes from a base color.",
    category: CATEGORIES.uiStyling,
    icon: PaletteIcon,
  },
  {
    title: "Color Space Converter",
    url: "/tools/color-converter",
    description: "Convert colors between HEX, RGB, HSL, OKLCH, and more.",
    category: CATEGORIES.uiStyling,
    icon: ArrowsClockwiseIcon,
  },
  {
    title: "CSS Animation Builder",
    url: "/tools/animation-builder",
    description:
      "Build CSS @keyframes animations visually with live preview and generated CSS output.",
    category: CATEGORIES.uiStyling,
    icon: PlayIcon,
  },
  {
    title: "CSS Aspect-Ratio Calculator",
    url: "/tools/aspect-ratio",
    description:
      "Calculate CSS aspect-ratio, Tailwind utility, and legacy padding-bottom values for any dimensions.",
    category: CATEGORIES.uiStyling,
    icon: FileCssIcon,
  },
  {
    title: "Cubic Bezier Editor",
    url: "/tools/cubic-bezier",
    description:
      "Design custom CSS easing curves with draggable control points and a live preview.",
    category: CATEGORIES.uiStyling,
    icon: CubeIcon,
  },
  {
    title: "Glassmorphism Generator",
    url: "/tools/glassmorphism-generator",
    description: "Generate beautiful glassmorphism UI elements with backdrop blur.",
    category: CATEGORIES.uiStyling,
    icon: CardsIcon,
  },
  {
    title: "GSAP Builder",
    url: "/tools/gsap-builder",
    description: "Visually build GSAP animations and generate optimized React 19 boilerplate.",
    category: CATEGORIES.uiStyling,
    icon: MagicWandIcon,
  },
  {
    title: "Layout Visualizer",
    url: "/tools/layout-visualizer",
    description: "Explore Tailwind Flex and Grid layout properties interactively.",
    category: CATEGORIES.uiStyling,
    icon: LayoutIcon,
  },
  {
    title: "Shadow Builder",
    url: "/tools/box-shadow-builder",
    description: "Visually generate CSS box-shadow styles with live preview.",
    category: CATEGORIES.uiStyling,
    icon: SquareIcon,
  },
  {
    title: "Tailwind Extractor Studio",
    url: "/tools/tailwind-extractor",
    description:
      "Extract inline Tailwind classes from JSX into @apply-based semantic CSS components.",
    category: CATEGORIES.uiStyling,
    icon: ScissorsIcon,
  },
  {
    title: "Tailwind CSS Cheatsheet",
    url: "/tools/tailwind-cheatsheet",
    description:
      "A searchable, filterable reference of the most-used Tailwind utility classes. Click any class to copy it.",
    category: CATEGORIES.uiStyling,
    icon: SwatchesIcon,
  },
  {
    title: "Tailwind Shades",
    url: "/tools/tailwind-shades",
    description: "Generate a full 50–950 Tailwind color scale from a single hex.",
    category: CATEGORIES.uiStyling,
    icon: EyedropperIcon,
  },
  {
    title: "WCAG Contrast Checker",
    url: "/tools/contrast-checker",
    description: "Check foreground/background contrast ratios against WCAG AA and AAA standards.",
    category: CATEGORIES.uiStyling,
    icon: EyeIcon,
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
