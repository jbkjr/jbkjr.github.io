import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { after, test } from "node:test"
import { fileURLToPath } from "node:url"

const script = fileURLToPath(new URL("./verify-site.mjs", import.meta.url))
const tmp = mkdtempSync(join(tmpdir(), "verify-site-"))
after(() => rmSync(tmp, { recursive: true, force: true }))

const footer = `<footer><ul>
  <li><a href="https://www.lesswrong.com/users/jbkjr">LessWrong</a></li>
  <li><a href="https://github.com/jbkjr">GitHub</a></li>
  <li><a href="https://linkedin.com/in/jbkjr">LinkedIn</a></li>
  <li><a href="/index.xml">RSS</a></li>
</ul></footer>`
const ogImage = (path) => `<meta property="og:image" content="https://jbkjr.me/${path}"/>`
const terms = Array.from({ length: 500 }, (_, i) => ({ headword: `term${i}`, slug: `t${i}` }))
const anchors = terms.map((t) => `<li id="${t.slug}">${t.headword}</li>`).join("")
const searchBox = `<input class="glossary-search-bar"/>`
const glossaryIndex = (entries = terms) =>
  `<script type="application/json" class="glossary-headword-index">${JSON.stringify(entries)}</script>`
const glossary = `${ogImage("dhamma/glossary-og-image.webp")}<a href="/dhamma/glossary.pdf">PDF</a>
  ${searchBox}${searchBox}${glossaryIndex()}<a href="#t0">first</a><ul>${anchors}</ul>${footer}`
const redirect = (target) => `<meta http-equiv="refresh" content="0; url=${target}">`

// A minimal output tree that satisfies every pin; each test breaks one thing.
function validSite() {
  const site = {
    "index.html": `${ogImage("index-og-image.webp")}10 posts<span>560 terms</span>2 projects</span>${footer}`,
    "404.html": `<a href="/posts">w</a><a href="/dhamma/glossary">g</a><a href="/projects">r</a>${footer}`,
    "index.css": "body{}",
    "prescript.js": "",
    "postscript.js": "",
    "index-og-image.webp": "x",
    "index.xml": `<rss><item><link>https://jbkjr.me/posts/a</link></item></rss>`,
    "sitemap.xml": `<urlset><url><loc>https://jbkjr.me/</loc></url><url><loc>https://jbkjr.me/dhamma/glossary</loc></url></urlset>`,
    "posts/a.html": footer,
    "posts/index.html": footer,
    "projects/index.html": `<div class="no-dates"></div>${footer}`,
    "dhamma/glossary.html": glossary,
    "dhamma/glossary-og-image.webp": "x",
    "dhamma/glossary.pdf": `%PDF-1.7${"x".repeat(200 * 1024)}`,
    "static/lw_icon.png": "x",
    "static/contentIndex.json": JSON.stringify({ "posts/a": {}, "dhamma/glossary": {} }),
  }
  for (let i = 0; i < 11; i++) site[`posts/2018/old${i}/index.html`] = redirect("../../a")
  return site
}

let counter = 0
function verify(changes = {}, env = process.env) {
  const root = join(tmp, `site-${counter++}`)
  for (const [file, content] of Object.entries({ ...validSite(), ...changes })) {
    if (content === null) continue
    mkdirSync(dirname(join(root, file)), { recursive: true })
    writeFileSync(join(root, file), content)
  }
  return spawnSync(process.execPath, [script, root], { encoding: "utf8", env })
}

function assertFails(changes, message) {
  const result = verify(changes)
  assert.equal(result.status, 1, result.stdout)
  assert.match(result.stderr, message)
}

test("a complete site passes", () => {
  const result = verify()
  assert.equal(result.status, 0, result.stderr)
})

test("a missing output directory fails rather than passing vacuously", () => {
  const result = spawnSync(process.execPath, [script, join(tmp, "nope")], { encoding: "utf8" })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /does not exist/)
})

test("a missing glossary PDF fails", () => {
  assertFails({ "dhamma/glossary.pdf": null }, /dhamma\/glossary\.pdf is missing/)
})

test("a PDF that isn't one, or is truncated, fails", () => {
  assertFails({ "dhamma/glossary.pdf": "x".repeat(200 * 1024) }, /is not a PDF/)
  assertFails({ "dhamma/glossary.pdf": "%PDF-1.7" }, /is only 8 bytes/)
})

test("the Download link must exist and reach the PDF", () => {
  assertFails(
    { "dhamma/glossary.html": glossary.replace('<a href="/dhamma/glossary.pdf">PDF</a>', "") },
    /no PDF download link/,
  )
  assertFails(
    { "dhamma/glossary.html": glossary.replace("/dhamma/glossary.pdf", "/dhamma/gone.pdf") },
    /does not resolve/,
  )
})

test("an alias pointing nowhere fails, as does losing aliases", () => {
  assertFails({ "posts/2018/old0/index.html": redirect("../../gone") }, /points at missing/)
  assertFails({ "posts/2018/old0/index.html": null }, /only 10 alias redirects/)
})

test("ignored authoring files must stay out of the output", () => {
  for (const file of [
    "dhamma/CLAUDE.html",
    "dhamma/AGENTS.html",
    "dhamma/TRANSLATION_CONVENTIONS.html",
    "dhamma/_working/GLOSSARY_AUDIT.html",
    "dhamma/_references/source.pdf",
  ]) {
    assertFails({ [file]: "x" }, /must not be published/)
  }
  assertFails(
    { "static/contentIndex.json": JSON.stringify({ "dhamma/_working/x": {} }) },
    /content index lists/,
  )
})

test("in-page glossary links and search entries need matching anchors", () => {
  assertFails(
    { "dhamma/glossary.html": glossary.replace('id="t0"', 'id="other"') },
    /link #t0 has no matching id/,
  )
  assertFails(
    { "dhamma/glossary.html": glossary.replace('id="t7"', 'id="other"') },
    /search entry t7 has no anchor/,
  )
})

test("the search index must be embedded exactly once, with its terms", () => {
  assertFails(
    { "dhamma/glossary.html": glossary + glossaryIndex() },
    /embeds the search index 2 times/,
  )
  assertFails(
    { "dhamma/glossary.html": glossary.replace(glossaryIndex(), "") },
    /embeds the search index 0 times/,
  )
  assertFails(
    {
      "dhamma/glossary.html": glossary.replace(glossaryIndex(), glossaryIndex(terms.slice(0, 10))),
    },
    /search index has 10 terms/,
  )
})

test("both search boxes must render", () => {
  assertFails(
    { "dhamma/glossary.html": glossary.replace(searchBox, "") },
    /has 1 search boxes, expected 2/,
  )
})

test("every page needs its footer links, but redirects don't", () => {
  assertFails({ "posts/a.html": "no footer" }, /posts\/a\.html has no footer/)
  assertFails(
    { "posts/a.html": footer.replace("https://github.com/jbkjr", "#") },
    /posts\/a\.html: footer lacks https:\/\/github\.com\/jbkjr/,
  )
  assertFails({ "posts/index.html": footer.replace("/index.xml", "#") }, /footer lacks index\.xml/)
  assert.equal(verify({ "static/standalone.html": "no footer" }).status, 0)
})

test("RSS and sitemap must exist and point at real pages", () => {
  assertFails({ "index.xml": null }, /index\.xml is not an RSS feed/)
  assertFails({ "sitemap.xml": null }, /sitemap\.xml is not a sitemap/)
  assertFails({ "index.xml": "<rss></rss>" }, /index\.xml has no items/)
  assertFails(
    { "index.xml": "<rss><item><link>https://jbkjr.me/posts/gone</link></item></rss>" },
    /feed URL https:\/\/jbkjr\.me\/posts\/gone does not resolve/,
  )
  assertFails(
    { "sitemap.xml": "<urlset><url><loc>https://jbkjr.me/</loc></url></urlset>" },
    /omits the glossary/,
  )
})

test("homepage counts, 404 links, list-page dates and og images are pinned", () => {
  assertFails({ "index.html": `${ogImage("index-og-image.webp")}${footer}` }, /homepage count/)
  assertFails({ "404.html": footer }, /404\.html lacks a link to \/posts/)
  assertFails({ "projects/index.html": footer }, /no longer hides dates/)
  assertFails({ "index-og-image.webp": null }, /og:image .* is missing/)
})

const oversizedIcon = { "static/lw_icon.png": "x".repeat(340 * 1024) }

test("an over-budget asset warns without failing the build", () => {
  const { GITHUB_ACTIONS: _ignored, ...env } = process.env
  const result = verify(oversizedIcon, env)
  assert.equal(result.status, 0, result.stderr)
  assert.match(
    result.stderr,
    /warning: static\/lw_icon\.png is \d+ bytes raw, over its \d+ byte budget/,
  )
  assert.match(result.stdout, /verify-site: ok/)

  const incompressible = Array.from({ length: 80000 }, (_, i) =>
    (i * 2654435761).toString(36),
  ).join("")
  const gzipped = verify({ "index.css": incompressible }, env)
  assert.equal(gzipped.status, 0, gzipped.stderr)
  assert.match(gzipped.stderr, /warning: index\.css is \d+ bytes gzipped/)
})

test("over-budget warnings become annotations on GitHub Actions", () => {
  const result = verify(oversizedIcon, { ...process.env, GITHUB_ACTIONS: "true" })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /^::warning::static\/lw_icon\.png is \d+ bytes raw/m)
})

test("an asset within budget prints no warning", () => {
  assert.doesNotMatch(verify().stderr + verify().stdout, /warning/)
})

test("a budgeted asset that is missing still fails", () => {
  assertFails({ "postscript.js": null }, /postscript\.js is missing/)
  assertFails({ "static/lw_icon.png": null }, /lw_icon\.png is missing/)
})

test("warnings don't hide structural failures", () => {
  const result = verify({ ...oversizedIcon, "dhamma/glossary.pdf": null })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /glossary\.pdf is missing/)
  assert.match(result.stdout + result.stderr, /lw_icon\.png is \d+ bytes raw/)
})
