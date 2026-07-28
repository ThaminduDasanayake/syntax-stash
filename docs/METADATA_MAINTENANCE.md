# Metadata & SEO Maintenance Guide

This document explains how metadata, SEO, dynamic open-graph cards, sitemaps, and search engine crawlers are configured and maintained in **Syntax Stash**.

---

## 📁 Architecture Overview

All metadata files in the project follow Next.js App Router conventions and are powered by a single centralized configuration file (`lib/site-config.ts`).

```
syntax-stash/
├── lib/
│   └── site-config.ts          # Central source of truth for site constants & URLs
├── app/
│   ├── layout.tsx              # Root site metadata & OpenGraph defaults
│   ├── sitemap.ts              # Dynamic sitemap generator (/sitemap.xml)
│   ├── robots.ts               # Crawler rules (/robots.txt)
│   ├── manifest.ts             # Web App Manifest (/manifest.webmanifest)
│   ├── opengraph-image.tsx     # Dynamic Edge social banner generator
│   ├── changelog/
│   │   └── page.tsx            # Changelog page (/changelog)
│   ├── tools/[slug]/
│   │   └── page.tsx            # Dynamic tool metadata generator
│   └── resources/[slug]/
│       └── page.tsx            # Dynamic resource category metadata generator
└── METADATA_MAINTENANCE.md     # This maintenance guide
```

---

## ⚙️ 1. Centralized Site Configuration (`lib/site-config.ts`)

`lib/site-config.ts` is the single source of truth for all metadata.

### How to update production URL:
If your production URL or domain changes, update `url` in `lib/site-config.ts`:

```ts
export const siteConfig = {
  name: "syntax-stash",
  shortName: "SyntaxStash",
  title: "syntax-stash — Curated Developer Tools & Resources",
  description: "A curated, open-source stash of developer tools, utilities, generators, and resources.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://syntax-stash.vercel.app", // <--- Production URL
  author: {
    name: "Thamindu Dasanayake",
    email: "thamindudasanayake@gmail.com",
    github: "https://github.com/ThaminduDasanayake",
  },
  themeColor: "#14110b",
  backgroundColor: "#f5f1e5",
} as const;
```

---

## 🌐 2. Root Layout Metadata (`app/layout.tsx`)

`app/layout.tsx` consumes `siteConfig` to provide default metadata for all pages:

- **Title Template**: `%s | syntax-stash` (Child pages automatically append `| syntax-stash` to their title).
- **Metadata Base**: Resolves all relative OpenGraph image URLs to your production domain.
- **OpenGraph & Twitter Cards**: Generates standard `<meta property="og:...">` tags.

### Adding metadata to a new page:
To add metadata to a new static page (e.g. `app/blog/page.tsx`), export a `metadata` object:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and updates from Syntax Stash.",
  alternates: { canonical: "/blog" },
};
```

---

## 🔍 3. Dynamic Route Metadata

For dynamic routes like `/tools/[slug]` or `/resources/[slug]`, metadata is generated dynamically per request/build using `generateMetadata()`:

```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = findItemBySlug(slug);

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/tools/${slug}` },
  };
}
```

---

## 🗺️ 4. Dynamic Sitemap (`app/sitemap.ts`)

Next.js automatically compiles `app/sitemap.ts` into `https://syntax-stash.vercel.app/sitemap.xml`.

- **Automatic Route Discovery**: When you add new tools in `lib/tools-data.ts` or new categories in `lib/resource-data/categories.ts`, `app/sitemap.ts` automatically generates sitemap entries for them.
- **Maintenance**: You do **not** need to update `sitemap.ts` manually when adding new tools or resources.

---

## 🤖 5. Robots & Web Manifest (`app/robots.ts` & `app/manifest.ts`)

- **`app/robots.ts`**: Serves `/robots.txt`. It allows indexing for all pages and links to `/sitemap.xml`.
- **`app/manifest.ts`**: Serves `/manifest.webmanifest`. Defines PWA metadata, theme color (`#14110b`), background color (`#f5f1e5`), and icon URLs for mobile devices.

---

## 🖼️ 6. Dynamic OpenGraph Social Image (`app/opengraph-image.tsx`)

`app/opengraph-image.tsx` uses `@vercel/og` (`ImageResponse`) to generate dynamic 1200x630 PNG preview images for social sharing (Twitter, Discord, Slack, LinkedIn).

- It executes on Vercel's Edge runtime.
- Uses your brand colors (`#14110b` dark background, `#f5f1e5` typography, `#e8a52b` accent).
- Customizes social previews dynamically with site text.

---

## 🧪 7. Verification & Maintenance CLI Commands

Whenever you edit metadata files, verify TypeScript types and ESLint sorting:

```bash
# Type check TypeScript definitions
npx tsc --noEmit

# Check for ESLint formatting and metadata ordering
npm run lint

# Auto-fix formatting and sorting
npm run lint:fix
```
