# Syntax Stash — Tasks & Backlog

## Database Schema & Normalization Roadmap

### Implemented Entities

- [x] **`author` Table**: Dedicated table for creators/maintainers (`id`, `name`, `slug`, `website`, `twitter`, `github`, `youtube`, `linkedin`, `blog`). Includes creator combobox autocomplete and auto-fill in all submission and resource forms.
- [x] **`category` Table**: Dedicated table for taxonomy (`id`, `name`, `slug`, `description`, `icon`, `themeColor`, `order`). Linked to `resource.categoryId` with full relational integrity, dynamic routing support, and seed automation.
- [x] **`tag` & `resource_tag` Tables**: Normalized many-to-many tag relations (`tag`, `resource_tag`) with automated seed routines, database tag aggregation API, and dynamic `/tags/[slug]` routing.
- [x] **`collection` & `collection_item` Tables**: User-owned custom stashes/folders (`collection`, `collection_item`) with full CRUD APIs (`/api/collections`), client hook (`useCollections`), and tabbed UI integration on `/saved`.
- [x] **`resource_health` Table (URL & Uptime Auditing Log)**: Dedicated table (`id`, `resource_id`, `status`, `status_code`, `redirect_url`, `error_message`, `last_checked_at`) with 1-click redirect application, live diagnostic ping API (`/api/admin/resources/health`), visual status badges, and database-synced CLI audits (`scripts/check-resource-health.ts`).

### Future Schema Additions

- [ ] **`github_repo_stats` (Live Repository Metrics)**:
  - **Context:** Move from static `lib/resource-data/github-stars.json` cache into Postgres.
  - **Schema:** `id`, `resource_id`, `owner`, `repo`, `stars`, `forks`, `open_issues`, `license`, `last_pushed_at`, `synced_at`.
  - **Benefits:** Dynamic SQL sorting by star count (`ORDER BY stars DESC`), license filtering, and star trajectory analytics.

### Properties Retained on Existing Tables (Do NOT Normalize)

- **`pricing`**: Kept as direct column/enum (`"Free" | "Freemium" | "Paid" | "Open Source"`) on `resource` and `submission` to avoid over-engineering.
- **`favicon` & `ogImage`**: Kept as direct asset URLs on `resource`.
- **Ephemeral Submission Fields**: Kept flat on `submission` (`submitterEmail`, `submitterName`, `notes`, `adminNotes`, `status`).

---

## Active & Pending Tasks

- [x] **Migrate Resources to Database & 1-Click Submission Approvals**
  - **Context:** Resources, authors, and categories are stored in Neon Postgres with Next.js edge caching (`unstable_cache` + `React.cache`) and instant 1-click submission approvals.
  - **Completed:**
    - [x] **Step 1: Database Schema Definition** (`author`, `category`, and `resource` tables with foreign keys, relations, and indices).
    - [x] **Step 2: Automated Seeding Script** (`scripts/seed-resources.ts` seeds 16 categories, 320 authors, and 1,286 tools).
    - [x] **Step 3: Data Access Layer & Edge Caching** (`lib/resources.ts` with fallback to static data and Next.js edge caching).
    - [x] **Step 4: 1-Click Submission Approval** (`PATCH /api/admin/submissions` auto-publishes to database and revalidates cache).
    - [x] **Step 5: Admin Live Resource Manager (`/admin/resources`)** (Dedicated web UI to edit catalog tools, visual cards & data grid with shadcn tabs, URL health badges, live ping tests, and 1-click redirect applicator).
    - [x] **Step 6: Update Audit & GitHub Star Scripts** (Updated health check and star sync scripts to query/persist directly to Neon Postgres).
    - [x] **Step 7: Verification & Testing** (`0 errors, 0 warnings`, build verified across 402 static pages).

- [ ] **Backfill Missing `github` links for Open-Source Resources**
  - **Context:** Currently, ~38 resources have `github` populated. Many other open-source tools, UI libraries, and developer utilities have public repositories that can be linked.
  - **Action Items:**
    - Add `github: "https://github.com/..."` to open-source entries as you come across them, or build an automated discovery script to scan site HTML for GitHub links.
    - Run `npm run sync:stars` to fetch star counts for newly added repositories.
    - Verify that the star badge renders on the cards, modal launch button, modal link section, and `Cmd + K` search.
