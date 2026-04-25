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
- Dhamma content lives in `content/dhamma/`; the generated glossary PDF is `content/dhamma/glossary.pdf` and is served at `/dhamma/glossary.pdf`.

## Dhamma Glossary

- Keep glossary implementation code under `custom/`: shared mdast transforms in `custom/glossary-transforms.ts`, the Quartz adapter in `custom/glossary.ts`, and glossary-only components in `custom/components/`.
- Keep `content/dhamma/glossary.md` clean source markdown. Do not commit explicit heading attributes like `{#part-i}` or `{.unlisted}`; the shared transform generates section IDs, entry anchors, and the curated TOC.
- The shared transform is used by both Quartz and `scripts/glossary/preprocess.mjs`, so HTML and PDF links stay aligned. It handles multi-headword entries, duplicate headword suffixes, section-qualified term links, validated section refs, and index links.
- PDF output is generated, not committed. Use `npm run glossary:pdf` to create `content/dhamma/glossary.pdf`; `npm run build` and `npm run serve` rebuild the PDF before running Quartz.
- The glossary page uses `GlossaryMeta` for "Last updated" from Quartz git/file dates and `GlossaryTOC` as a narrow-screen inline TOC; desktop still uses the right-rail Quartz TOC.

## Working Agreements

- Ask before altering published content or major design elements.
- Highlight testing gaps and recommend verification steps with changes.
- Keep explanations concise but include key context for decisions.
