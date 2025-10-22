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
- ✅ Committed: "Initial Quartz setup" (89ac7b6)

### What's Next

- [ ] Migrate 11 blog posts from `master` branch to `content/`
- [ ] Set up GitHub Actions workflow for automatic deployment to GitHub Pages
- [ ] Customize theme/layout/components as desired
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
- **Note**: User is open to modifying framework files for customization

### Build Artifacts (DO NOT COMMIT)

- `public/` - Generated site (gitignored)
- `node_modules/` - Dependencies (gitignored)
- `.quartz-cache/` - Build cache (gitignored)

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

# Check for errors
npm run check

# Format code
npm run format
```

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

## Notes

- This is a personal learning project, not a rush
- User wants to understand the "why" behind decisions
- Customization is encouraged - this should be a unique site
- Public-facing site, so quality matters
