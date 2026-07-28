# Changelog

All notable changes to **Syntax Stash** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-07-28

### Added
- **Dynamic Metadata Centralization**: Introduced `lib/site-config.ts` to centralize all site URLs, author details, metadata defaults, and keywords.
- **Dynamic OpenGraph Image**: Added `app/opengraph-image.tsx` using `next/og` for Edge-rendered high-res social preview cards.
- **SEO & Discovery**: Created dynamic `app/sitemap.ts` (`/sitemap.xml`) and `app/robots.ts` (`/robots.txt`).
- **Web App Manifest**: Added `app/manifest.ts` (`/manifest.webmanifest`) for PWA and mobile bookmark support.
- **Changelog Page**: Added `/changelog` route and updated footer navigation.
- **Contributing Guide**: Added `CONTRIBUTING.md` and `METADATA_MAINTENANCE.md`.

### Fixed
- **Category Dot Colors**: Updated `DotButton` and modal chip dot styles with category-specific themes and deep border colors (`border-blue-deep`, `border-green-deep`, etc.).
- **Hover Transitions**: Resolved group-hover state handling on resource modal chip buttons.

---

## [1.1.0] - 2026-06-15

### Added
- Integrated live client-side tools: Regex Studio, Diff Viewer, Cron Studio, SQL Formatter.
- Dynamic category filtering and real-time search across tools and resource links.

---

## [1.0.0] - 2026-05-01

### Added
- Initial public release of Syntax Stash with 100+ curated developer links and resources.
- High-contrast brutalist design system built with Next.js App Router and Tailwind CSS.
