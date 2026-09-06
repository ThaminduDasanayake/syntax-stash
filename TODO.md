# Syntax Stash — Tasks & Backlog

## Pending Tasks

- [x] **Migrate Resources to Database & 1-Click Submission Approvals**
  - **Context:** Resources and authors are now stored in Neon Postgres with Next.js edge caching (`unstable_cache` + `React.cache`) and instant 1-click submission approvals.
  - **Completed:**
    - [x] **Step 1: Database Schema Definition** (`author` and `resource` tables with `github` column, relations, and indices).
    - [x] **Step 2: Automated Seeding Script** (`scripts/seed-resources.ts` seeded 1,286 tools and 320 authors).
    - [x] **Step 3: Data Access Layer & Edge Caching** (`lib/resources.ts` with fallback to static data and Next.js edge caching).
    - [x] **Step 4: 1-Click Submission Approval** (`PATCH /api/admin/submissions` auto-publishes to database and revalidates cache).
    - [ ] **Step 5: Admin Live Resource Manager (`/admin/resources`)** (Dedicated web UI to edit existing catalog tools).
    - [ ] **Step 6: Update Audit & GitHub Star Scripts** (Update health check and star sync scripts to query/update DB).
    - [x] **Step 7: Verification & Testing** (`0 errors, 0 warnings`, build verified across 402 static pages).

- [ ] **Backfill Missing `gitHubLink`s for Open-Source Resources**
  - **Context:** Currently, ~38 resources have `gitHubLink` populated. Many other open-source tools, UI libraries, and developer utilities have public repositories that can be linked.
  - **Action Items:**
    - Add `gitHubLink: "https://github.com/..."` to open-source entries as you come across them, or build an automated discovery script to scan site HTML for GitHub links.
    - Run `npm run sync:stars` to fetch star counts for newly added repositories.
    - Verify that the star badge renders on the cards, modal launch button, modal link section, and `Cmd + K` search.
