# Syntax Stash — Tasks & Backlog

## Pending Tasks

- [ ] **Migrate Resources to Database & Build Live Admin Resource Manager**
  - **Context:** Currently, ~2,000 resources live in static `.ts` files in `lib/resource-data/`. Migrating resources to the Neon Postgres database enables instant 1-click submission approvals, web-based in-place editing of existing tools, direct admin tool creation, and deletion without touching code or waiting for deployments. Next.js edge caching ensures 0ms latency for visitors.
  - **Action Items & Steps:**
    - [ ] **Step 1: Database Schema Definition**
      - Add the `resource` table to [`lib/db/schema.ts`](file:///Users/thamindudasanayake/Developer/Nextjs/syntax-stash/lib/db/schema.ts) with fields: `id`, `title`, `subtitle`, `category`, `description`, `url` (unique), `favicon`, `ogImage`, `author`, `authorLink`, `authorTwitter`, `authorGitHub`, `authorYouTube`, `authorLinkedIn`, `gitHubLink`, `tags`, `isFeatured`, `createdAt`, `updatedAt`.
      - Run `npm run db:push` to apply the migration to Neon Postgres.
    - [ ] **Step 2: Automated Seeding Script**
      - Create `scripts/seed-resources.ts` to import `resourceLinks` from `lib/resource-data/index.ts` and batch-insert all ~2,000 existing resources into the database with `onConflictDoNothing()`.
      - Run `npx tsx scripts/seed-resources.ts` to populate the database.
    - [ ] **Step 3: Data Access Layer & Edge Caching**
      - Create a cached getter `getAllResources()` in `lib/resources.ts` using Next.js `unstable_cache` with tag `"resources"` and revalidation.
      - Update [`app/page.tsx`](file:///Users/thamindudasanayake/Developer/Nextjs/syntax-stash/app/page.tsx), [`components/stash-catalog.tsx`](file:///Users/thamindudasanayake/Developer/Nextjs/syntax-stash/components/stash-catalog.tsx), and authors pages to read from the cached DB layer.
    - [ ] **Step 4: 1-Click Submission Approval**
      - Update `PATCH /api/admin/submissions` so approving a submission automatically inserts/updates the item in the `resource` table.
      - Call `revalidatePath("/")` and `revalidateTag("resources")` on approval for instant live catalog updates.
    - [ ] **Step 5: Admin Live Resource Manager (`/admin/resources`)**
      - Build a dedicated admin management interface at `/admin/resources` to search, filter, edit, delete, and add new resources directly from the browser.
      - Support in-place modal editing for title, category, description, tags, URLs, and author social links.
    - [ ] **Step 6: Update Audit & GitHub Star Scripts**
      - Update [`scripts/check-resource-health.ts`](file:///Users/thamindudasanayake/Developer/Nextjs/syntax-stash/scripts/check-resource-health.ts) and [`scripts/sync-github-stars.ts`](file:///Users/thamindudasanayake/Developer/Nextjs/syntax-stash/scripts/sync-github-stars.ts) to read from and update the database directly.
    - [ ] **Step 7: Verification & Testing**
      - Run `npm run lint` and `npx tsc --noEmit`.
      - Verify catalog filtering, search, pagination, bookmarking, and author pages work seamlessly.

- [ ] **Backfill Missing `gitHubLink`s for Open-Source Resources**
  - **Context:** Currently, ~38 resources have `gitHubLink` populated. Many other open-source tools, UI libraries, and developer utilities have public repositories that can be linked.
  - **Action Items:**
    - Add `gitHubLink: "https://github.com/..."` to open-source entries as you come across them, or build an automated discovery script to scan site HTML for GitHub links.
    - Run `npm run sync:stars` to fetch star counts for newly added repositories.
    - Verify that the star badge renders on the cards, modal launch button, modal link section, and `Cmd + K` search.
