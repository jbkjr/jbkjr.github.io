# Claude Context: Jack Koch's Personal Website

## Project Overview

Personal website and blog for Jack Koch, rebuilt from Jekyll to Quartz v4.5.2 static site generator.

- **Purpose**: Personal blog/website with custom features
- **Tech Stack**: Quartz (TypeScript/Node.js), hosted on GitHub Pages
- **Learning Context**: This project is also for learning effective Claude collaboration

## Current State

Active branch: `master` (Quartz site, deployed via GitHub Actions on push).

### Content Structure

- **Posts**: 10 blog posts in `content/posts/` (flat structure, no date prefixes)
  - Sorted by date (newest first) in Explorer and listing pages
  - Individual posts hidden from Explorer (accessed via `/posts` listing page or graph)
  - Old Jekyll URLs redirect via `aliases` frontmatter + AliasRedirects plugin
- **Projects**: 2 project pages in `content/projects/`
  - Goal Misgeneralization, Understanding Agency
  - Visible in Explorer with expand/collapse functionality
- **Tags**: 13-tag taxonomy for semantic clustering in graph view
  - Umbrella: `ai`
  - Technical: `nlp`, `language-models`, `transfer-learning`, `semantic-parsing`, `reinforcement-learning`
  - Safety: `ai-safety`
  - Ethics: `buddhism`, `suffering`
  - Meta: `career`, `cause-prioritization`
  - Unique: `metamodernism`

### Key Customizations

- **Typography**: Open Sans for headers/body, IBM Plex Mono for code
- **Explorer**: Custom posts folder icon, empty folder UX fixes, link-mode folders
- **Listing Page**: Minimal 2-column (date | title) design
- **Homepage landing** (`custom/components/HomeLanding.tsx`): destination cards +
  recent-posts list rendered under the intro prose. Card counts are derived from
  `allFiles` (and, for the glossary, from its emitted headword index), so they
  never need hand-updating. Card copy lives in `quartz.layout.ts`.
- **Reading progress** (`custom/components/ReadingProgress.tsx`): hairline scroll
  indicator on every page except the homepage.
- **404**: links into Writing / Glossary / Research, not just "return home."
- **Footer**: links the RSS feed (`/index.xml`), which `ContentIndex` already emitted.
- **Bug Fixes**: Font URL encoding, footnote popover caching, mobile horizontal
  overflow (the mobile Explorer drawer was `position: absolute` inside the padded
  left sidebar, so its `100vw` width overhung the viewport; the footer link row
  didn't wrap)

### Deployment

Push to `master` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. No manual step.

## Key Configuration Files

- `quartz.config.ts` - Site metadata, theme, plugins
- `quartz.layout.ts` - Layout/component configuration, Explorer settings
- `eslint.config.js` - Code quality linting (only custom code, not framework)
- `.prettierrc` - Code formatting (runs on pre-commit hook)
- `CNAME` - Domain configuration

## Explorer Configuration

### Custom Folder Icons Pattern

**Use case**: Create folders with custom icons (like posts) that link directly to their index page without dropdown expansion.

**Requirements**:

1. Folder should have no visible children in Explorer (filtered out)
2. Clicking folder name/icon → navigate to folder index page
3. Unified hover behavior (icon and text highlight together)

**Implementation** (3 files):

**1. Filter out children** - `quartz.layout.ts`:

```typescript
Component.Explorer({
  folderClickBehavior: "link", // Makes folders navigate to index on click
  filterFn: (node) => {
    // Hide individual post pages (but keep posts folder)
    if (node.data?.slug?.startsWith("posts/") && !node.isFolder) return false
    return true
  },
})
```

**2. Add folder detection** - `quartz/components/scripts/explorer.inline.ts`:

```typescript
// Around line 160, in createFolderNode function, add:
if (node.slugSegment === "posts") {
  li.classList.add("posts-folder") // Or whatever folder name
}
```

**3. Add custom icon CSS** - `quartz/components/styles/explorer.scss`:

```scss
// Custom icon for posts folder (stack of documents)
li.posts-folder {
  & > .folder-container > .folder-icon {
    display: none; // Hide default triangle
  }

  & > .folder-container::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    flex-shrink: 0;
    background-color: var(--secondary);
    mask-image: url("data:image/svg+xml,..."); // Your SVG here
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    transition: background-color 0.2s ease;
    pointer-events: none; // Let clicks pass through to link
  }

  &:hover > .folder-container::before {
    background-color: var(--tertiary); // Icon hover color
  }
}
```

**Automatic unified hover**: The `.empty-folder` class (applied when `node.children.length === 0` after filtering) automatically adds unified hover behavior:

```scss
// Already in explorer.scss (lines 219-229)
li.empty-folder {
  & > .folder-container > .folder-icon {
    display: none; // Hide triangle
  }

  // Unified hover: highlight link text when hovering anywhere on empty folder
  &:hover > .folder-container div > a {
    color: var(--tertiary);
  }
}
```

This means any custom icon folder with no visible children will automatically have both icon and text highlight together on hover.

### Current Explorer Settings

```typescript
// quartz.layout.ts
Component.Explorer({
  folderClickBehavior: "link", // All folders navigate on click
  folderDefaultState: "collapsed", // Folders closed by default
  filterFn: (node) => {
    if (node.slugSegment === "tags") return false // Hide tags folder
    if (node.data?.slug?.startsWith("posts/") && !node.isFolder) return false // Hide individual posts
    return true
  },
  sortFn: (a, b) => {
    // Posts sorted by date (newest first), others alphabetically
    // Full logic in quartz.layout.ts
  },
})
```

**Effect**:

- Posts folder: Custom icon, links to `/posts`, no children visible
- Projects folder: Default triangle, links to `/projects`, children visible + expandable
- Tags folder: Hidden from Explorer entirely

## Quartz Bug Fixes Applied

### Font URL Encoding (`quartz/util/theme.ts`)

**Issue**: Multi-word font names (like "Open Sans") weren't URL-encoded for Google Fonts API.

**Fix**: Added `encodeURIComponent()` to font names before building API URL.

### Footnote Popover Caching (`quartz/components/scripts/popover.inline.ts`)

**Issue**: All footnotes showed the same popover (cached by pathname only, not hash).

**Fix**: Include hash in popover ID: `popover-${link.pathname}${hashForId}`

## Development Workflow

### Commands

```bash
npm run serve             # Build glossary PDF + dev server with hot reload (port 8080)
npm run build             # Build glossary PDF + static site (one-shot)
npm run glossary:pdf      # Just rebuild content/dhamma/glossary.pdf
npm run test              # tsx --test (currently covers custom/glossary-transforms.test.ts)
npm run check             # Type checking + format checking
npm run format            # Auto-format with Prettier
npm run lint              # Lint code
npm run lint:fix          # Lint + auto-fix
```

Quartz CLI (`npx quartz build --serve`) works but skips the glossary PDF step — prefer the npm scripts.

### Git Practices

- Work on `master` (default) — the rebuild branch is dormant
- Clear, descriptive commit messages
- Pre-commit hook auto-formats code with Prettier

### Communication Preferences

- **Design decisions**: Discuss options and tradeoffs collaboratively
- **Non-trivial implementations**: Explain what's happening and why
- **Trivial changes**: Just proceed without asking
- **Be educational**: User is learning, explanations add value

## File Structure

```
content/                    # All markdown files and images
  ├── index.md             # Homepage
  ├── posts/               # Blog posts (flat structure)
  ├── projects/            # Project pages
  ├── dhamma/              # Glossary + editorial conventions (see content/dhamma/CLAUDE.md)
  └── images/              # Post images

quartz/                     # Framework (can be modified for customization)
  ├── components/          # UI components (React/TSX)
  ├── plugins/             # Content processing plugins
  ├── styles/              # Global styles
  └── util/                # Utilities (includes bug fixes)

custom/                     # Project-local code that isn't an upstream Quartz patch
  ├── glossary-transforms.ts      # Shared mdast transform (used by Quartz + PDF preprocess)
  ├── glossary-transforms.test.ts # tsx --test
  ├── glossary.ts                 # Quartz adapter
  └── components/                 # GlossaryMeta, GlossaryTOC

scripts/glossary/           # Glossary PDF build pipeline
  ├── build-pdf.sh         # Pandoc → LaTeX → PDF
  ├── header.tex           # LaTeX preamble
  └── preprocess.mjs       # Runs the same shared transform headlessly for PDF

quartz.config.ts            # Main configuration
quartz.layout.ts            # Layout configuration
CLAUDE.md                   # This file
```

## Quartz Markdown Features

Quick reference for writing posts:

**Callouts** (for highlighting information):

```markdown
> [!note]
> General information or notes

> [!tip]
> Helpful suggestions or recommendations

> [!warning]
> Important cautions or warnings

> [!abstract]
> Summaries or overviews
```

**Other callout types**: `info`, `todo`, `success`, `question`, `failure`, `danger`, `bug`, `example`, `quote`

**Math**: Inline `$E = mc^2$` or block `$$\sum_{i=1}^{n} x_i$$`

**Wikilinks**: `[[slug]]` or `[[slug|display text]]` for internal links

## Dhamma Glossary

Implementation lives in `custom/`: shared mdast transform in `custom/glossary-transforms.ts`, Quartz adapter in `custom/glossary.ts`, glossary-only React components (`GlossaryMeta`, `GlossaryTOC`) in `custom/components/`. Keep `content/dhamma/glossary.md` as clean source markdown — don't commit explicit heading attributes (`{#part-i}`, `{.unlisted}`); the shared transform generates section IDs, entry anchors, and the curated TOC.

The shared transform runs in two places — Quartz (web build) and `scripts/glossary/preprocess.mjs` (PDF build) — so HTML and PDF cross-links stay aligned. PDF output is generated, not committed: `npm run glossary:pdf` regenerates `content/dhamma/glossary.pdf`; `npm run build` and `npm run serve` rebuild the PDF before running Quartz.

The glossary page swaps in `GlossaryMeta` (Last-updated from Quartz git/file dates) and `GlossaryTOC` (narrow-screen inline TOC); desktop keeps the right-rail Quartz TOC. The graph is conditionally dropped on this page — the glossary has almost no outbound wikilinks, so its graph was a stub and the (very long) TOC needed the room.

`GlossarySearch` searches **both** Pāli headwords and English glosses, so "craving" finds `taṇhā`. The index is built by the shared transform: for each entry it records the headword, its Part label (`III.a`), and the gloss — the text between the headword's em-dash and the start of the italic rendering-note. Italics _inside_ a clause (`cognate with English _thirst_`) are cited words and stay in the gloss; a note is only recognized after clause-ending punctuation or the em-dash itself (`NOTE_BOUNDARY_RE`). Results show headword · Part · gloss with the match highlighted; `/` focuses the box, and jumping to an entry flashes it so the target is findable in a 1,900-line page.

Note that Quartz's SPA router handles same-page anchors with `scrollIntoView` + `pushState` and fires **no** `hashchange`, so anything reacting to in-page jumps has to hook the click as well.

- Editorial / authoring conventions for the glossary content (headword rules, 15-Part stratum spine, def-flags, translation clusters) live at [`content/dhamma/CLAUDE.md`](content/dhamma/CLAUDE.md). Read it before editing [`content/dhamma/glossary.md`](content/dhamma/glossary.md). [`content/dhamma/AGENTS.md`](content/dhamma/AGENTS.md) is a symlink to the same file.
- Translation rendering reference (Kumāra-2022 EBT samādhi/jhāna cluster, etc.) at [`content/dhamma/TRANSLATION_CONVENTIONS.md`](content/dhamma/TRANSLATION_CONVENTIONS.md) — internal working file, not cited from `glossary.md`.
- Reference lexica (DPD, MW, PED, Apte, etc.) live at `content/dhamma/_references/` — a gitignored symlink pointing into `~/iCloud/jbkjr/BUDDHA/dhamma/dhamma glossary/_references/`. One-time setup from the repo root: `ln -s ~/iCloud/jbkjr/BUDDHA/dhamma/dhamma\ glossary/_references content/dhamma/_references`.
- The three instruction files (`CLAUDE.md`, `AGENTS.md`, `TRANSLATION_CONVENTIONS.md`) are excluded from the Quartz build via `ignorePatterns` in [`quartz.config.ts`](quartz.config.ts).

## Notes

- User is open to modifying Quartz framework files for customization
- This is a learning project - understanding "why" is important
- Public-facing site - quality matters
