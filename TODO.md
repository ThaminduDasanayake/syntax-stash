# Syntax Stash — Tasks & Backlog

## Active & Pending Tasks

### 1. Shadcn Component Adoptions & UI Modernization

- [ ] **Collections Create Dialog Checkbox**:
  - **File:** `components/collections/collections-view.tsx` (Line 333)
  - **Task:** Replace raw `<input type="checkbox">` and `<label>` with shadcn `<CheckboxField>` or `<Checkbox>`.
- [ ] **Design System Showcase Table**:
  - **File:** `components/design-system-showcase.tsx` (Line 1077)
  - **Task:** Replace raw HTML `<table>` tags with shadcn `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>` components.
- [ ] **Collapsible Component Import Standardization**:
  - **File:** `app/tools/json-studio/tabs/query-tab.tsx`
  - **Task:** Standardize import from local `@/components/ui/collapsible` wrapper instead of direct `@radix-ui/react-collapsible`.
- [ ] **Developer Tools Controls Audit**:
  - **Context:** Audit inputs and options in `app/tools/*` to standardize on shadcn primitives (`SliderField`, `SwitchField`, `Tabs`, `Badge`, `Tooltip`, `StepperField`).

### 2. Asset & Resource Curation

- [ ] **Backfill Missing Icons & OG Images with Cloudinary CDN**:
  - **Context:** Curate missing favicons / SVGs and OG screenshots for resources flagged with `missing-og` and `missing-favicon` health filters in `/admin/resources`.
  - **Action Items:** Use the integrated Cloudinary upload buttons in `/admin/resources/[id]` to upload high-res SVGs and custom screenshots.
- [ ] **Backfill Missing `github` Links for Open-Source Resources**:
  - **Context:** Expand GitHub repository links for open-source libraries, dev tools, and generators.
  - **Action Items:**
    - Add `github: "https://github.com/..."` to entries in `/admin/resources`.
    - Run `npm run sync:stars` to sync live star counts.

---

## Database Schema & Backlog

### Future Schema Additions

- [ ] **`github_repo_stats` (Live Repository Metrics)**:
  - **Context:** Move from static `lib/github-stars.json` cache into Postgres.
  - **Schema:** `id`, `resource_id`, `owner`, `repo`, `stars`, `forks`, `open_issues`, `license`, `last_pushed_at`, `synced_at`.
  - **Benefits:** Dynamic SQL sorting by star count (`ORDER BY stars DESC`), license filtering, and star trajectory analytics.

### Properties Retained on Existing Tables (Do NOT Normalize)

- **`pricing`**: Kept as direct column/enum (`"Free" | "Freemium" | "Paid" | "Open Source"`) on `resource` and `submission` to avoid over-engineering.
- **`favicon` & `ogImage`**: Kept as direct asset URLs on `resource`.
- **Ephemeral Submission Fields**: Kept flat on `submission` (`submitterEmail`, `submitterName`, `notes`, `adminNotes`, `status`).
