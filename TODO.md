# Syntax Stash — Tasks & Backlog

## Active & Pending Tasks

### 1. Shadcn Component Adoptions & UI Modernization

- [x] **Collections Create Dialog Checkbox**:
  - **File:** `components/collections/collections-view.tsx` (Line 333)
  - **Task:** Replaced raw `<input type="checkbox">` and `<label>` with shadcn `<CheckboxField>`.
- [x] **Design System Showcase Table**:
  - **File:** `components/design-system-showcase.tsx` (Line 1077)
  - **Task:** Replaced raw HTML `<table>` tags with shadcn `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>` components.
- [x] **Collapsible Component Import Standardization**:
  - **File:** `app/tools/json-studio/tabs/query-tab.tsx`
  - **Task:** Standardized import from local `@/components/ui/collapsible` wrapper instead of direct `@radix-ui/react-collapsible`.
- [x] **Developer Tools Controls Audit**:
  - **Context:** Audited inputs and options in `app/tools/*` and standardized controls on shadcn primitives (`SliderField`, `SwitchField`, `Tabs`, `Badge`, `Tooltip`, `StepperField`, `InputField`, `SelectField`).

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

My own additions

- need to make the edit, copy json and delete buttons in the admin pages
- deep dice into internal tools and only get free tools from icons8
- https://www.svgrepo.com/ tools inside this
