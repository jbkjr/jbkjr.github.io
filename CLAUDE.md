# Claude Context: Jack Koch's Personal Website

## Project Overview

Personal website and blog for Jack Koch, rebuilt from Jekyll to Quartz v4.5.2 static site generator.

- **Purpose**: Personal blog/website with custom features
- **Tech Stack**: Quartz (TypeScript/Node.js), hosted on GitHub Pages
- **Learning Context**: This project is also for learning effective Claude collaboration

## Current State (as of 2025-10-22)

### Branch Structure

- `master` - Old Jekyll site (preserved, contains 11 blog posts from 2018-2024)
- `quartz-rebuild` - ✅ NEW Quartz setup (current working branch)

### What's Done

- ✅ Quartz v4.5.2 installed and configured
- ✅ Basic configuration (site title, baseUrl, footer links)
- ✅ Test homepage created (`content/index.md`)
- ✅ Local dev server working (`npx quartz build --serve` on port 8080)
- ✅ Development tooling configured (Prettier, ESLint, pre-commit hook)
- ✅ Typography customization: Open Sans applied for headers and body text
- ✅ Font Preference Finder tool created (ELO rating + characteristic tracking)
- ✅ Fixed Quartz bug: font names with spaces now properly URL-encoded
- ✅ Design exploration page created for testing typography changes
- ✅ Committed: "Initial Quartz setup" (89ac7b6)
- ✅ Committed: "Add CLAUDE.md for project context and collaboration guidelines" (d631c7b)
- ✅ Committed: "Apply Open Sans typography and add Font Preference Finder" (d2c024f)

### What's Next

- [ ] Migrate 11 blog posts from `master` branch to `content/`
- [ ] Set up GitHub Actions workflow for automatic deployment to GitHub Pages
- [ ] Further theme customization (colors, layout)
- [ ] Replace test content with real homepage content
- [ ] Add About page

### Old Content to Migrate (on master branch)

11 blog posts in `_posts/`:

- 2024-05-02: Why I stopped working on AI safety
- 2024-06-18: Suffering is not pain
- 2020-12-17: Mapping conceptual territory
- 2020-11-29: Getting started with Spinning Up
- 2020-10-08: Better x-risk terminology
- 2019-01-09: Unsupervised pretraining comparison
- 2018-12-24: ELMo semantic parsing
- 2018-12-15: Rick and Morty
- 2018-10-04: FastAI OpenAI Transformer
- 2018-06-20: Need ML safety researchers
- 2018-06-06: Welcome post

Also: images in `images/`, some PDFs in `files/`

## Key Files & Structure

### Configuration Files (customize these)

- `quartz.config.ts` - Main config (site metadata, theme, plugins)
- `quartz.layout.ts` - Layout/component configuration
- `eslint.config.js` - ESLint configuration (code quality linting)
- `.prettierrc` - Prettier configuration (code formatting)
- `CNAME` - Domain configuration for GitHub Pages

### Content

- `content/` - ALL markdown files and images go here
  - `content/index.md` - Homepage
  - Folder structure becomes URL structure

### Quartz Framework

- `quartz/` - Framework source code
  - `quartz/components/` - UI components (React/TSX)
  - `quartz/plugins/` - Content processing plugins
  - `quartz/styles/` - Global styles
  - `quartz/util/theme.ts` - Theme utilities (MODIFIED: fixed font URL encoding bug)
- **Note**: User is open to modifying framework files for customization

### Build Artifacts (DO NOT COMMIT)

- `public/` - Generated site (gitignored)
- `node_modules/` - Dependencies (gitignored)
- `.quartz-cache/` - Build cache (gitignored)

### Tools & Utilities

- `font-finder-v2.html` - Font Preference Finder tool (main version)
- `quartz/static/font-finder.html` - Hosted copy of font finder (accessible at `/static/font-finder.html`)
- `content/design-exploration.md` - Test page for exploring design changes

## Working Preferences

### Communication Style

- **Explain design choices** - Walk through options and tradeoffs together
- **Explain non-trivial implementations** - Help user understand what's happening
- **Trivial stuff** - Just proceed without asking
- **Be educational** - User is learning, explanations are valuable

### Development Workflow

1. **Test locally before committing** - Always run `npx quartz build --serve` to verify changes
2. **Explain tools before using** - Especially npm, git, and unfamiliar commands
3. **Collaborative design** - Discuss architecture/design decisions together
4. **Lead on implementation** - Claude can take initiative on coding details

### Git Practices

- Clear, descriptive commit messages
- Stay on `quartz-rebuild` branch until ready to merge
- Don't accidentally work on `master` (it has the old site)

## Development Commands

```bash
# Start local dev server (with hot reload)
npx quartz build --serve

# Build once
npx quartz build

# Type checking + format checking
npm run check

# Auto-format code with Prettier
npm run format

# Lint code for quality issues
npm run lint

# Lint and auto-fix issues
npm run lint:fix
```

## Development Tooling

### Code Quality Setup

**Prettier (Auto-formatting)**

- Config: `.prettierrc`
- Runs automatically on every commit via pre-commit hook
- Manual run: `npm run format`
- Settings: 100 char line width, 2-space tabs, no semicolons, trailing commas

**ESLint (Code Linting)**

- Config: `eslint.config.js` (ESLint v9 modern format)
- Only lints custom code (ignores `quartz/` framework directory)
- Catches code quality issues, unused variables, type errors
- Manual run: `npm run lint`
- Auto-fix: `npm run lint:fix`

**Pre-commit Hook**

- Location: `.git/hooks/pre-commit`
- Automatically runs `npm run format` before every commit
- Ensures all committed code is properly formatted
- No action needed - works automatically

### npm Package Management

- All packages install locally to `node_modules/` (no virtual environment needed)
- Dependencies tracked in `package.json` and `package-lock.json`
- Framework code in `quartz/`, custom code outside it
- ESLint configured to only check custom code, not framework

## Typography Configuration

### Current Typography Settings

```typescript
// In quartz.config.ts
typography: {
  header: "Open Sans",
  body: "Open Sans",
  code: "IBM Plex Mono",
}
```

**Design Decision**: Using Open Sans consistently for all text (headers and body) based on scientific preference testing. Code font remains distinct (IBM Plex Mono) for readability.

**Alternative Option**: PT Serif (humanist serif) scored 2nd in preference testing and could be reconsidered in the future.

### Font Preference Finder Tool

Built a comprehensive tool (`font-finder-v2.html`) to scientifically determine font preferences:

**Features**:

- ELO rating system (K-factor: 32, initial rating: 1500) to rank 22 fonts
- Characteristic tracking across 7 dimensions: contrast, x-height, width, weight, formality, readability, style
- 3-phase tournament structure: category exploration → cross-category → finals
- Dynamic font loading (only 2 fonts per matchup for reliable rendering)
- Canvas-based font verification to ensure proper rendering
- Data export to JSON

**Technical Implementation**:

- Loads fonts dynamically per matchup to avoid race conditions
- Uses `document.fonts.ready` API + canvas measurement for verification
- Properly encodes font names for Google Fonts API URLs
- Tracks user characteristic preferences to identify patterns

### Quartz Bug Fix: Font URL Encoding

**Issue**: Font names with spaces (like "Open Sans") weren't being URL-encoded when generating Google Fonts API URLs, causing fonts to fail to load.

**Fix Location**: `quartz/util/theme.ts:88-94`

**Solution**: Added `encodeURIComponent()` to properly encode font names:

```typescript
export function googleFontHref(theme: Theme) {
  const { header, body, code } = theme.typography
  const headerFont = encodeURIComponent(formatFontSpecification("header", header))
  const bodyFont = encodeURIComponent(formatFontSpecification("body", body))
  const codeFont = encodeURIComponent(formatFontSpecification("code", code))

  return `https://fonts.googleapis.com/css2?family=${headerFont}&family=${bodyFont}&family=${codeFont}&display=swap`
}
```

**Impact**: This fix benefits any Quartz user using multi-word font names. Before: `"Open Sans"` → broken URL. After: `"Open Sans"` → `"Open%20Sans"` → working URL.

## Useful Context

### Quartz Documentation

- Extensive docs in `docs/` folder
- Online: https://quartz.jzhao.xyz/
- Architecture diagram: `docs/images/quartz transform pipeline.png`

## Questions for User

When unsure about:

- **Design decisions** - Always discuss (colors, layouts, features)
- **Content changes** - Ask before modifying/deleting real content
- **Framework modifications** - Discuss impact and alternatives
- **Deployment** - Confirm GitHub Pages setup approach

## Future Considerations

Ideas to potentially implement later (not immediate priorities):

- **Web-based editor**: Decap CMS or similar for publishing posts from browser (not needed for now, comfortable with vim + git workflow)

## Notes

- This is a personal learning project, not a rush
- User wants to understand the "why" behind decisions
- Customization is encouraged - this should be a unique site
- Public-facing site, so quality matters
