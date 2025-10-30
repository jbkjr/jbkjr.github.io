# Agents Brief: Jack Koch's Personal Website

## Project Snapshot

- Personal blog rebuilt on Quartz v4.5.2; hosted via GitHub Pages.
- Active work happens on `quartz-rebuild`; legacy Jekyll site preserved on `master`.
- Latest progress includes migrated posts, typography tweaks, and bug fixes for fonts and popovers.

## Tech & Tooling

- Core stack: Quartz (TypeScript/Node.js). Content lives in `content/`.
- Key configs: `quartz.config.ts`, `quartz.layout.ts`, `.prettierrc`, `eslint.config.js`, `CNAME`.
- Tooling: Prettier, ESLint, npm scripts (`npm run format`, `npm run lint`), Quartz CLI (`npx quartz build --serve` on port 8080).

## Collaboration Priorities

- Maintain URL backward compatibility using `aliases` in post frontmatter.
- Preserve typography choices (Open Sans headers/body, IBM Plex Mono code) unless explicitly revisited.
- Treat Quartz framework files (`quartz/`) as upstream; custom changes live outside unless coordinated.
- Surface rationale when proposing design/content shifts; user values understanding the "why."

## Recent Fixes to Respect

- Font loader patch: `quartz/util/theme.ts` now URL-encodes font names.
- Footnote popover fix: `quartz/components/scripts/popover.inline.ts` includes hash in cache key.
- Explorer improvements: posts sorted newest-first; folders collapsed by default.

## Current Focus Areas

- Pending: GitHub Actions deploy workflow, richer theme customization, real homepage content, About page.
- Optional: Explorer sidebar styling refinements, reconsider alternate typography (e.g., PT Serif).

## Content & URL Structure

- Posts stored flat under `content/posts/{slug}.md`; clean URLs `/posts/{slug}`.
- Each post frontmatter includes `aliases` mapping old `/posts/YYYY/MM/slug/` paths.
- Images reside in `content/images/`; index/root content in `content/index.md`.

## Working Agreements

- Ask before altering published content or major design elements.
- Highlight testing gaps and recommend verification steps with changes.
- Keep explanations concise but include key context for decisions.
