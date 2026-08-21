# Changelog

All notable changes to **Syntax Stash** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-08-21

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

## [1.3.0] - 2026-08-04

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

## [1.2.0] - 2026-07-28

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

## [1.1.0] - 2026-06-15

### Added

- **Client-Side Tools Expansion**: Integrated live client-side tools: Regex Studio, Diff Viewer, Cron Studio, and SQL Formatter.
- **Search & Filtering**: Dynamic category filtering and real-time search across tools and resource links.
- **Theme Transitions**: Implemented wave transition animation for smooth light/dark theme switching.

---

## [1.0.0] - 2026-05-01

### Added

- **Initial Public Release**: Launched Syntax Stash featuring 100+ curated developer resources and tools.
- **Brutalist UI System**: High-contrast brutalist design system built with Next.js App Router, Tailwind CSS, and Phosphor Icons.
- **Developer Toolbelt**: Released 40+ client-side developer utilities including JSON Studio, Document Extractor, JSON Schema Studio, and ASCII Studio running 100% locally.
