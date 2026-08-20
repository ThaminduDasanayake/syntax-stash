# syntax-stash ⚡

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> A curated reference manual and interactive workbench for modern web development.

**[syntax-stash](https://syntax-stash.vercel.app)** brings together **41 client-side interactive tools** (converters, formatters, studios, and generators) and **100+ handpicked resources** across 16 categories — wrapped in a modern neo-brutalist user interface.

---

## 🌟 Key Features

- **⚡ 41 Inbuilt Interactive Workbench Tools**: Full-fledged in-browser tools for data transformation, frontend visual editing, code generation, and developer workflows.
- **📚 100+ Curated Resources Vault**: Handpicked developer links spanning frameworks, animation engines, UI component libraries, AI tools, and typography foundries.
- **🔒 100% Client-Side Privacy**: Data parsing, hash generation, document extractions (PDF, DOCX), image conversions, and JWT decodes are executed locally inside your browser using Web APIs.
- **🔎 Instant Search & Tag Filtering**: Fuzzy search with Fuse.js, URL-synced multi-tag filtering, category tabs, and interactive modal resource inspectors.
- **🎨 Neo-Brutalist Design System**: Built with Tailwind CSS v4 `@theme inline` utilities, custom color themes (orange, blue, pink, green), crisp typography, and fluid card carousels.

---

## 🛠️ Inbuilt Utilities (41 Tools)

### 📊 Data & Encoding Utilities

| Tool                          | Description                                                                    |
| :---------------------------- | :----------------------------------------------------------------------------- |
| **cURL Command Builder**      | Visual builder and bidirectional parser for `curl` commands.                   |
| **Encoder / Decoder**         | Instant conversion between Base64, URL-encoding, and Hex format.               |
| **Hash Generator**            | Compute SHA-1, SHA-256, SHA-384, and SHA-512 digests via Web Crypto API.       |
| **JSON / CSV Converter**      | Convert arrays to CSV and back with custom delimiters and field flattening.    |
| **JSON Schema Studio**        | Convert JSON payloads into TypeScript types, Zod schemas, and Pydantic models. |
| **JSON Studio**               | Interactive tree browser, query evaluator, formatter, and validator for JSON.  |
| **JWT Decoder**               | Inspect header, payload, and claim expiration timestamps locally.              |
| **Mock Data Generator**       | Generate structured mock JSON data schemas for API testing.                    |
| **Mongo Aggregation Builder** | Visually scaffold complex MongoDB aggregation pipelines with live output.      |
| **Universal Decoder**         | Detect and decode JWTs, Unix timestamps, UUIDs, ObjectIds, and Snowflake IDs.  |
| **XML Studio**                | Bidirectional XML/JSON converter and syntax formatter.                         |
| **YAML / JSON Converter**     | High-performance YAML and JSON converter with inline syntax error feedback.    |

### 🛠️ Developer Tools & Infrastructure

| Tool                        | Description                                                                                  |
| :-------------------------- | :------------------------------------------------------------------------------------------- |
| **.gitignore Generator**    | Generate production `.gitignore` templates for 50+ languages and frameworks.                 |
| **chmod Calculator**        | Bidirectional interactive grid calculator for octal and symbolic Unix permissions.           |
| **Code Stash**              | Searchable snippet workbench for essential boilerplate and config patterns.                  |
| **Cron Studio**             | Build cron schedules with a field editor, plain-English translation, and execution timeline. |
| **CSV to Markdown Table**   | Format raw CSV/TSV spreadsheets into clean Markdown tables.                                  |
| **Diff Viewer**             | Side-by-side and unified diff comparator for text and source code.                           |
| **Docker Compose Studio**   | Scaffold compose files visually or convert `docker run` commands to YAML.                    |
| **Drizzle Schema Studio**   | Convert raw SQL `CREATE TABLE` statements or Prisma models to Drizzle schemas.               |
| **Git Cheatsheet**          | Searchable reference of ~70 Git commands organized by intent and risk level.                 |
| **JSDoc / TSDoc Generator** | Generate `@param`, `@returns`, and `@throws` docstrings from JS/TS signatures.               |
| **Secret Generator**        | Generate cryptographically secure keys for Next.js, Django, Laravel, and Rails.              |
| **SQL Query Formatter**     | Prettify raw SQL queries with custom indentation and keyword capitalization.                 |
| **Text Analyzer**           | Character, word, line, byte count, and LLM token estimation (tiktoken estimation).           |
| **UUID Generator**          | Bulk generate v4 (random) and v7 (time-ordered) UUIDs.                                       |

### 🎨 Frontend & Design System

| Tool                              | Description                                                                                  |
| :-------------------------------- | :------------------------------------------------------------------------------------------- |
| **Color Studio**                  | Convert HEX/RGB/HSL/OKLCH, generate harmonic color palettes, and check WCAG contrast.        |
| **CSS Studio**                    | Visual generator for border-radius, box-shadow, glassmorphism, bezier curves, and keyframes. |
| **CSS to Tailwind**               | Convert standard CSS declarations into equivalent Tailwind CSS v4 utility classes.           |
| **HTML to JSX**                   | Transform raw HTML into React JSX with inline style objects and camelCase attributes.        |
| **HTTP Security Header Analyzer** | Score response headers against OWASP security guidelines with recommended fixes.             |
| **HTTP Status Reference**         | Comprehensive reference of HTTP response codes, semantics, and debugging tips.               |
| **Regex Studio**                  | Test, visualize, and browse a production library of regular expressions.                     |
| **String Case Converter**         | Convert text between camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE, etc.      |
| **Tailwind Studio**               | Browse utility classes, generate 50–950 color shade scales, and convert to `@apply`.         |
| **URL Parser & Builder**          | Deconstruct URLs into origin, pathname, hash, and interactive query parameters.              |
| **Web Extractor**                 | Extract Open Graph meta tags, headings, and internal/external links from web pages.          |

### 🖼️ Media & File Processing

| Tool                    | Description                                                                      |
| :---------------------- | :------------------------------------------------------------------------------- |
| **Document Extractor**  | Extract raw text and LLM markdown from PDF, DOCX, HTML, CSV, and text files.     |
| **Image Converter**     | Batch process, resize, and convert WebP, HEIC, TIFF, PNG, and JPG in-browser.    |
| **Mermaid Live Editor** | Render sequence, flowchart, state, and ER diagrams with live SVG preview.        |
| **QR Generator**        | Create customizable, high-resolution QR codes with downloadable PNG/SVG exports. |

---

## 🧰 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack) & [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com), `@tailwindcss/typography`, `@theme inline`
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **State & UI**: [Base UI](https://base-ui.com/), [Radix UI](https://www.radix-ui.com/), [Sonner](https://sonner.emilkowal.ski/)
- **Syntax Highlighting**: [Shiki](https://shiki.style)
- **Data & Parsing Libraries**:
  - Color Science: `chroma-js`
  - Diagrams: `mermaid`
  - Documents & Parsers: `pdf-parse`, `mammoth`, `cheerio`, `turndown`
  - Image Encoders: `heic2any`, `utif`, `gifenc`
  - Search: `fuse.js`
  - Cron Parsing: `cron-parser`, `cronstrue`

---

## 📁 Directory Structure

```
syntax-stash/
├── app/                      # Next.js App Router routes & layouts
│   ├── api/                  # API routes (e.g. metadata extraction)
│   ├── changelog/            # Release history & project updates
│   ├── resources/            # Vault index & category pages
│   ├── tools/                # All 41 interactive tool page routes
│   ├── globals.css           # Tailwind v4 configuration & design system utilities
│   └── page.tsx              # Homepage hero & spotlight carousels
├── components/               # React UI components
│   ├── ui/                   # Reusable primitive UI components (Buttons, Dialogs, Inputs)
│   ├── card-icon.tsx         # Dynamic favicon & tool icon resolver
│   ├── filter-section.tsx    # Universal search & category filter engine
│   ├── resource-dialog.tsx   # Detailed resource modal inspector
│   ├── tool-card.tsx         # Interactive card component
│   └── tools-carousel.tsx    # Snap-scrolling card carousel
├── lib/                      # Business logic, helpers, and data sources
│   ├── resource-data/        # 100+ curated resources grouped by category
│   ├── tools-data.ts         # Metadata & configuration for all 41 tools
│   ├── site-config.ts        # App metadata & branding configuration
│   └── utils.ts              # Theme mappers, slugifiers, and string helpers
├── types/                    # TypeScript interfaces & types
└── public/                   # Static assets & favicons
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 20+** installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/ThaminduDasanayake/syntax-stash.git
cd syntax-stash
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

### 5. Linting & Formatting

```bash
# Run ESLint check
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Check formatting with Prettier
npm run format:check

# Format code with Prettier
npm run format
```

---

## 🤝 Contributing

Contributions, bug reports, and new tool/resource suggestions are welcome!

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/amazing-tool`).
3. Commit your changes (`git commit -m 'Add amazing new tool'`).
4. Push to the branch (`git push origin feature/amazing-tool`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 👨‍💻 Author

**Thamindu Dasanayake**

- **GitHub**: [@ThaminduDasanayake](https://github.com/ThaminduDasanayake)
- **Website**: [syntax-stash.vercel.app](https://syntax-stash.vercel.app)
