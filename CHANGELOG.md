# Changelog

All notable changes and updates to **Syntax Stash** are documented here chronologically by release date.

---

## [2026-09-24] - September 24, 2026

### Added

- **Admin Management Suite**:
  - **Live URL Health & Drift Scanner**: Integrated diagnostic tools to probe HTTP response codes, detect permanent/temporary redirects (301/308), anti-bot/WAF challenges, broken links, and track metadata drift for favicons and OpenGraph images.
  - **Submissions & Review Workflow**: Full submission inspection portal (`SubmissionsView`, `SubmissionInspectView`) with candidate scrapers, external link validation, and 1-click publishing.
  - **Entity Management Dialogs**: Dedicated dialogs and managers for Categories, Authors, and Tags with auto-slug generation, social links, and confirmation diff dialogs.
  - **Word-Level Diffing**: Visual comparison modal (`ConfirmEditDialog`) for precise, field-by-field review before committing administrative updates.
- **GitHub Stars Syncing**: Background synchronization script (`sync:stars`) with pool concurrency, rate-limit resilience, and precomputed dataset caching (`lib/github-stars.json`).
- **Public Author Profiles & Directory**: Added `/authors` directory and individual author profile pages (`/authors/[slug]`) featuring author bios, verified social links, and associated catalog tools.
- **Authentication & Saved Collections**: Integrated Better Auth with PostgreSQL persistence for user bookmarks, alongside dedicated `/saved` library view with JSON import/export tools.
- **Legal & Compliance Pages**: Added Privacy Policy (`/privacy`) and Terms of Service (`/terms`) routes.
- **Dynamic OpenGraph Engine**: Standardized edge-rendered OpenGraph images using shared templates, custom fonts, and real-time vault stats.

### Changed

- **Resource Dialog Mobile UX**: Redesigned dialog header with smooth scroll-to-morph title animations, responsive button sizing, and overscroll bounce physics.
- **Footer & Tech Stack Grid**: Overhauled site footer with interactive multi-column grid and modern SVG tech stack wordmarks (Next.js, Neon, Drizzle ORM, Better Auth, Tailwind CSS).
- **Metadata Scraping Pipeline**: Enhanced head parser with theme-aware SVG favicon extraction, ScrapingBee fallback handling, and retry mechanisms.
- **Icon System**: Standardized social and external link SVG icons (GitHub, LinkedIn, YouTube) to consistent 1:1 square aspect ratios.

### Refactored

- **Admin Component Architecture**: Modularized admin directory structure, removed legacy prefixes and barrel files, and centralized entity sorting and shared form field components.

---

## [2026-08-21] - August 21, 2026

### Added

- **Interactive Homepage Tools Carousel**: Added interactive `ToolsCarousel` on the homepage featuring card-by-card snap scrolling (`scroll-snap-stop: always`), button navigation controls, and unclipped hover state elevation (`hover:z-10`).
- **Resource Vault Additions**: Added 30+ new curated tools, fonts, and resources across Typography (Commit Mono, FiraCode, JetBrains Mono, JuliaMono, LINE Seed, Nerd Fonts, Server Mono, Hack), Media, Development, and Inspiration collections.
- **Security Hardening & Headers**: Added global HTTP Security Headers in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and server-side SSRF private IP validation in route handlers.
- **Project Infrastructure**: Overhauled `README.md` documentation, added `.env.example`, and configured `vercel.json` deployment rules for the `main` branch.

### Changed

- **Landing Page Redesign**: Redesigned homepage hero layout, typography, and added a resource vault category showcase section.
- **Category Layout Fix**: Enforced full-width layout (`cat-section w-full`) across filter sections to prevent category dividers and card grids from squishing on single-item views.
- **Footer Attribution**: Updated footer bottom bar to display project copyright alongside author attribution and GitHub profile link.
- **Metadata Scraping Engine**: Implemented direct-fetch fallback with ScrapingBee fallback and standardized meta-tag extraction.

---

## [2026-08-04] - August 04, 2026

### Added

- **Single Source of Truth Changelog**: Implemented server-side `lib/changelog.ts` parser to read `CHANGELOG.md` directly and render `/changelog` dynamically at build time.
- **Dedicated Category Modules**: Created dedicated resource modules for `Typography` (`typography-resources.ts`), `Color & Gradients` (`color-resources.ts`), and `Icons & Illustrations` (`icon-resources.ts`).
- **Curated Resource Additions**: Added 50+ new curated links across AI, Design, Development, Frontend, Typography, Colors, and Icons.

### Changed

- **Resource Recategorization**: Re-indexed and migrated over 100+ resource entries out of `design`, `frontend`, and `dev` into dedicated modules.
- **Footer & Navigation Overhaul**: Redesigned footer layout with interactive link animations, project descriptions, and streamlined navigation.
- **Category Theme System**: Updated `ResourceTheme` color mappings to follow a standardized repeating palette (Orange → Blue → Pink → Green).

### Removed

- **Unused Routes**: Removed redundant fallback route `app/tools/[slug]/page.tsx`.
- **Unused UI Components**: Pruned 5 unused Shadcn UI components (`sidebar`, `alert-dialog`, `context-menu`, `breadcrumb`, `hover-card`).
- **Boilerplate Assets**: Cleaned up default `create-next-app` starter icons from `/public`.

---

## [2026-07-28] - July 28, 2026

### Added

- **Dynamic Metadata Centralization**: Introduced `lib/site-config.ts` to centralize all site URLs, author details, metadata defaults, and keywords.
- **Dynamic OpenGraph Image**: Added `app/opengraph-image.tsx` using `next/og` for Edge-rendered high-res social preview cards.
- **SEO & Discovery**: Created dynamic `app/sitemap.ts` (`/sitemap.xml`) and `app/robots.ts` (`/robots.txt`).
- **Web App Manifest**: Added `app/manifest.ts` (`/manifest.webmanifest`) for PWA and mobile bookmark support.
- **Changelog Route**: Added initial `/changelog` route and updated footer navigation.
- **Contributing Guides**: Added `CONTRIBUTING.md` and `METADATA_MAINTENANCE.md`.

### Fixed

- **Category Dot Colors**: Updated `DotButton` and modal chip dot styles with category-specific themes and deep border colors (`border-blue-deep`, `border-green-deep`, etc.).
- **Hover Transitions**: Resolved group-hover state handling on resource modal chip buttons.

---

## [2026-06-15] - June 15, 2026

### Added

- **Client-Side Tools Expansion**: Integrated live client-side tools: Regex Studio, Diff Viewer, Cron Studio, and SQL Formatter.
- **Search & Filtering**: Dynamic category filtering and real-time search across tools and resource links.
- **Theme Transitions**: Implemented wave transition animation for smooth light/dark theme switching.

---

## [2026-05-01] - May 01, 2026

### Added

- **Initial Public Launch**: Launched Syntax Stash featuring curated developer resources and utilities.
- **Brutalist UI System**: High-contrast brutalist design system built with Next.js App Router, Tailwind CSS, and Phosphor Icons.
- **Developer Toolbelt**: Released 40+ client-side developer utilities including JSON Studio, Document Extractor, JSON Schema Studio, and ASCII Studio running 100% locally.
