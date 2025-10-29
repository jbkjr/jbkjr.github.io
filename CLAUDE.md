# Claude Context: Jack Koch's Personal Website

## Project Overview

Personal website and blog for Jack Koch, rebuilt from Jekyll to Quartz v4.5.2 static site generator.

- **Purpose**: Personal blog/website with custom features
- **Tech Stack**: Quartz (TypeScript/Node.js), hosted on GitHub Pages
- **Learning Context**: This project is also for learning effective Claude collaboration

## Current State

### Branch Structure

- `master` - Old Jekyll site (preserved, not actively developed)
- `quartz-rebuild` - ✅ Current working branch

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
- **Bug Fixes**: Font URL encoding, footnote popover caching

### What's Next

- [ ] GitHub Actions workflow for deployment to GitHub Pages
- [ ] Real homepage content (currently test content)
- [ ] About page
- [ ] Theme refinements (colors, spacing)

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
npx quartz build --serve  # Dev server with hot reload (port 8080)
npx quartz build          # Build once
npm run check             # Type checking + format checking
npm run format            # Auto-format with Prettier
npm run lint              # Lint code
npm run lint:fix          # Lint + auto-fix
```

### Git Practices

- Work on `quartz-rebuild` branch
- Clear, descriptive commit messages
- Pre-commit hook auto-formats code with Prettier
- Don't accidentally commit to `master`

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
  └── images/              # Post images

quartz/                     # Framework (can be modified for customization)
  ├── components/          # UI components (React/TSX)
  ├── plugins/             # Content processing plugins
  ├── styles/              # Global styles
  └── util/                # Utilities (includes bug fixes)

quartz.config.ts            # Main configuration
quartz.layout.ts            # Layout configuration
CLAUDE.md                   # This file
```

## Notes

- User is open to modifying Quartz framework files for customization
- This is a learning project - understanding "why" is important
- Public-facing site - quality matters
- GitHub Pages deployment pending
