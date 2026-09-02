# Syntax Stash — Tasks & Backlog

## Pending Tasks

- [ ] **Backfill Missing `gitHubLink`s for Open-Source Resources**
  - **Context:** Currently, ~38 resources have `gitHubLink` populated. Many other open-source tools, UI libraries, and developer utilities in `lib/resource-data/*.ts` have public repositories that can be linked.
  - **Action Items:**
    - Add `gitHubLink: "https://github.com/..."` to open-source entries as you come across them, or build an automated discovery script to scan site HTML for GitHub links.
    - Run `npm run sync:stars` to fetch star counts for newly added repositories.
    - Verify that the star badge renders on the cards, modal launch button, modal link section, and `Cmd + K` search.
