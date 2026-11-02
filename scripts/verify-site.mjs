#!/usr/bin/env node
// Pins what the published site must contain, checked against the built output.
// Quartz builds happily when a page, asset or link goes missing, and that is how
// the glossary PDF disappeared for seven weeks (see scripts/glossary/build-pdf.sh),
// so `npm run build` ends here and a failure stops the deploy. Byte budgets only
// warn: the glossary grows often, and a page growing shouldn't block publishing.
//
// Usage: node scripts/verify-site.mjs [dir]   (default: public)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

const SITE_ORIGIN = "https://jbkjr.me"
const GLOSSARY_PAGE = "dhamma/glossary.html"
const GLOSSARY_PDF = "dhamma/glossary.pdf"
const MIN_PDF_BYTES = 100 * 1024
const MIN_GLOSSARY_TERMS = 500
const MIN_ALIAS_REDIRECTS = 11 // Jekyll-era URLs that inbound links still use
const FOOTER_LINKS = [
  "https://www.lesswrong.com/users/jbkjr",
  "https://github.com/jbkjr",
  "https://linkedin.com/in/jbkjr",
  "index.xml",
]
const NOT_FOUND_LINKS = ["/posts", "/dhamma/glossary", "/projects"]
const HOME_COUNTS = [/\d+ posts</, /\d+ terms</, /\d+ projects</]
// Authoring material under content/ that must never reach the site.
const NEVER_PUBLISHED =
  /(^|\/)(_working|_references|private|templates|\.obsidian)(\/|$)|(^|\/)(CLAUDE|AGENTS|TRANSLATION_CONVENTIONS)(\.|\/|$)/i

const KB = 1024
// Page and shared-asset weight, about 15-20% above the sizes when last set. Going
// over prints a warning. Raise a budget when the growth is expected content. Gzip
// approximates what the CDN sends; PNG and PDF don't compress.
const GZIP_BUDGETS = {
  "index.html": 14 * KB,
  [GLOSSARY_PAGE]: 145 * KB,
  "index.css": 12 * KB,
  "prescript.js": 2 * KB,
  "postscript.js": 255 * KB,
  "static/contentIndex.json": 150 * KB,
}
const RAW_BUDGETS = {
  "static/lw_icon.png": 10 * KB,
  [GLOSSARY_PDF]: 2 * KB * KB,
}

function walk(root, dir = root) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(root, path) : [relative(root, path).split(sep).join("/")]
  })
}

// Mirrors how Pages serves the output: /a/b finds a/b, a/b.html or a/b/index.html.
function servedFile(root, urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]).replace(/^\/+|\/+$/g, "")
  const candidates = clean ? [clean, `${clean}.html`, `${clean}/index.html`] : ["index.html"]
  return candidates.find((c) => existsSync(join(root, c)) && statSync(join(root, c)).isFile())
}

function resolveHref(root, page, href) {
  if (href.startsWith(`${SITE_ORIGIN}/`) || href === SITE_ORIGIN) {
    return servedFile(root, href.slice(SITE_ORIGIN.length))
  }
  if (href.startsWith("/")) return servedFile(root, href)
  const target = relative(root, resolve(root, dirname(page), href))
  return target.startsWith("..") ? undefined : servedFile(root, target.split(sep).join("/"))
}

const hrefsIn = (html) => [...html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)].map((m) => m[1])
const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")

function checkPdf(site, fail) {
  const path = join(site.root, GLOSSARY_PDF)
  if (!existsSync(path)) return fail(`${GLOSSARY_PDF} is missing`)
  const bytes = readFileSync(path)
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") fail(`${GLOSSARY_PDF} is not a PDF`)
  if (bytes.length < MIN_PDF_BYTES) fail(`${GLOSSARY_PDF} is only ${bytes.length} bytes`)
}

function checkGlossaryPage(site, fail) {
  const html = site.read(GLOSSARY_PAGE)
  if (html === undefined) return fail(`${GLOSSARY_PAGE} is missing`)

  const download = hrefsIn(html).filter((href) => href.endsWith(".pdf"))
  if (download.length === 0) fail(`${GLOSSARY_PAGE} has no PDF download link`)
  for (const href of download) {
    if (resolveHref(site.root, GLOSSARY_PAGE, href) !== GLOSSARY_PDF) {
      fail(`${GLOSSARY_PAGE}: download link ${href} does not resolve to ${GLOSSARY_PDF}`)
    }
  }

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  const fragments = hrefsIn(html)
    .filter((href) => href.startsWith("#") && href.length > 1)
    .map((href) => decodeURIComponent(href.slice(1)))
  if (fragments.length === 0) fail(`${GLOSSARY_PAGE} has no in-page anchors`)
  for (const fragment of new Set(fragments)) {
    if (!ids.has(fragment)) fail(`${GLOSSARY_PAGE}: link #${fragment} has no matching id`)
  }

  const indexes = [
    ...html.matchAll(/<script[^>]*class="glossary-headword-index"[^>]*>(.*?)<\/script>/gs),
  ]
  if (indexes.length !== 1) {
    return fail(`${GLOSSARY_PAGE} embeds the search index ${indexes.length} times, expected once`)
  }
  const entries = JSON.parse(indexes[0][1])
  const terms = new Set(entries.map((entry) => entry.headword.normalize("NFC"))).size
  if (terms < MIN_GLOSSARY_TERMS) {
    fail(`${GLOSSARY_PAGE}: search index has ${terms} terms, expected ${MIN_GLOSSARY_TERMS}+`)
  }
  for (const entry of entries) {
    if (!ids.has(entry.slug)) fail(`${GLOSSARY_PAGE}: search entry ${entry.slug} has no anchor`)
  }
  const searchBoxes = html.match(/class="glossary-search-bar"/g)?.length ?? 0
  if (searchBoxes !== 2) fail(`${GLOSSARY_PAGE} has ${searchBoxes} search boxes, expected 2`)
}

function checkAliases(site, fail) {
  const redirects = site.html.flatMap((page) => {
    const match = site.read(page).match(/http-equiv="refresh" content="0; url=([^"]+)"/)
    return match ? [[page, decodeEntities(match[1])]] : []
  })
  if (redirects.length < MIN_ALIAS_REDIRECTS) {
    fail(`only ${redirects.length} alias redirects, expected ${MIN_ALIAS_REDIRECTS}+`)
  }
  for (const [page, target] of redirects) {
    if (!resolveHref(site.root, page, target)) fail(`alias ${page} points at missing ${target}`)
  }
  // static/ holds standalone files (giscus themes, tools), not Quartz pages.
  const redirecting = new Set(redirects.map(([from]) => from))
  site.pages = site.html.filter((page) => !redirecting.has(page) && !page.startsWith("static/"))
}

function checkIgnored(site, fail) {
  for (const file of site.files) {
    if (NEVER_PUBLISHED.test(file)) fail(`${file} must not be published`)
  }
  const index = site.read("static/contentIndex.json")
  if (index === undefined) return fail("static/contentIndex.json is missing")
  for (const slug of Object.keys(JSON.parse(index))) {
    if (NEVER_PUBLISHED.test(slug)) fail(`content index lists ${slug}, which must not be published`)
  }
}

function checkFooters(site, fail) {
  for (const page of site.pages) {
    const footer = site.read(page).match(/<footer.*?<\/footer>/s)?.[0]
    if (!footer) {
      fail(`${page} has no footer`)
      continue
    }
    const hrefs = hrefsIn(footer)
    for (const link of FOOTER_LINKS) {
      if (!hrefs.some((href) => href === link || href.endsWith(`/${link}`))) {
        fail(`${page}: footer lacks ${link}`)
      }
    }
  }
}

function checkFeeds(site, fail) {
  const rss = site.read("index.xml")
  if (rss === undefined || !rss.includes("<rss")) fail("index.xml is not an RSS feed")
  const sitemap = site.read("sitemap.xml")
  if (sitemap === undefined || !sitemap.includes("<urlset")) fail("sitemap.xml is not a sitemap")

  const items = [...(rss ?? "").matchAll(/<item>.*?<link>(.*?)<\/link>/gs)].map((m) => m[1])
  const locs = [...(sitemap ?? "").matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  if (items.length === 0) fail("index.xml has no items")
  if (locs.length === 0) fail("sitemap.xml has no URLs")
  for (const url of [...items, ...locs]) {
    if (!url.startsWith(`${SITE_ORIGIN}/`)) fail(`feed URL ${url} is not on ${SITE_ORIGIN}`)
    else if (!resolveHref(site.root, "index.html", url)) fail(`feed URL ${url} does not resolve`)
  }
  if (!locs.includes(`${SITE_ORIGIN}/dhamma/glossary`)) fail("sitemap.xml omits the glossary")
}

function checkPages(site, fail) {
  const home = site.read("index.html") ?? ""
  for (const count of HOME_COUNTS) {
    if (!count.test(home)) fail(`index.html lacks the homepage count ${count.source}`)
  }

  const notFound = site.read("404.html") ?? ""
  for (const link of NOT_FOUND_LINKS) {
    if (!hrefsIn(notFound).includes(link)) fail(`404.html lacks a link to ${link}`)
    else if (!resolveHref(site.root, "404.html", link)) fail(`404.html: ${link} does not resolve`)
  }

  if (!(site.read("projects/index.html") ?? "").includes('class="no-dates"')) {
    fail("projects/index.html no longer hides dates")
  }

  for (const page of ["index.html", GLOSSARY_PAGE]) {
    const image = (site.read(page) ?? "").match(/property="og:image" content="([^"]+)"/)?.[1]
    if (!image) fail(`${page} has no og:image`)
    else if (!resolveHref(site.root, page, image)) fail(`${page}: og:image ${image} is missing`)
  }
}

function checkBudgets(site, fail, warn) {
  const check = (file, budget, size, unit) => {
    if (size > budget) warn(`${file} is ${size} bytes ${unit}, over its ${budget} byte budget`)
  }
  for (const [file, budget] of Object.entries(GZIP_BUDGETS)) {
    const path = join(site.root, file)
    if (!existsSync(path)) fail(`${file} is missing`)
    else check(file, budget, gzipSync(readFileSync(path)).length, "gzipped")
  }
  for (const [file, budget] of Object.entries(RAW_BUDGETS)) {
    const path = join(site.root, file)
    if (!existsSync(path)) fail(`${file} is missing`)
    else check(file, budget, statSync(path).size, "raw")
  }
}

export function verifySite(root) {
  if (!existsSync(root)) {
    return { failures: [`${root} does not exist; build the site first`], warnings: [] }
  }
  const failures = []
  const warnings = []
  const fail = (message) => failures.push(message)
  const warn = (message) => warnings.push(message)
  const files = walk(root)
  const site = {
    root,
    files,
    html: files.filter((file) => file.endsWith(".html")),
    pages: [],
    read: (file) =>
      existsSync(join(root, file)) ? readFileSync(join(root, file), "utf8") : undefined,
  }

  checkPdf(site, fail)
  checkGlossaryPage(site, fail)
  checkAliases(site, fail) // also sets site.pages, which checkFooters reads
  checkIgnored(site, fail)
  checkFooters(site, fail)
  checkFeeds(site, fail)
  checkPages(site, fail)
  checkBudgets(site, fail, warn)
  return { failures: [...new Set(failures)], warnings }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] ?? "public")
  const { failures, warnings } = verifySite(root)
  for (const warning of warnings) {
    // Actions turns this stdout form into an annotation on the run summary.
    if (process.env.GITHUB_ACTIONS) console.log(`::warning::${warning}`)
    else console.error(`verify-site: warning: ${warning}`)
  }
  if (failures.length > 0) {
    console.error(`verify-site: ${failures.length} problem(s) in ${root}`)
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }
  console.log("verify-site: ok")
}
