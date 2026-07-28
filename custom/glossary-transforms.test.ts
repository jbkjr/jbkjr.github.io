import assert from "node:assert/strict"
import test from "node:test"
import type { Heading, Link, Root, Text } from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"

import { applyGlossaryTransforms, asciiSlug } from "./glossary-transforms"

function transform(markdown: string) {
  const tree = unified().use(remarkParse).parse(markdown) as Root
  const file = {
    data: {} as {
      toc?: Array<{ depth: number; text: string; slug: string }>
      glossaryHeadwords?: Array<{ headword: string; slug: string; part: string; gloss: string }>
    },
  }
  applyGlossaryTransforms(tree, { slug: "dhamma/glossary" }, file as never)
  return { file, tree }
}

function anchorIds(tree: Root): string[] {
  const ids: string[] = []
  visit(tree, (node) => {
    if (node.type === "heading") {
      const id = (node as Heading).data?.hProperties?.id
      if (typeof id === "string") ids.push(id)
    }

    if (node.type === "text") {
      const data = (node as Text).data as
        | { hName?: string; hProperties?: { id?: string } }
        | undefined
      if (data?.hName === "span" && data.hProperties?.id) ids.push(data.hProperties.id)
    }
  })
  return ids
}

function links(tree: Root): Array<{ text: string; url: string }> {
  const found: Array<{ text: string; url: string }> = []
  visit(tree, "link", (node: Link) => {
    found.push({ text: mdastToString(node), url: node.url })
  })
  return found
}

test("adds readable section, canonical, qualified, duplicate, and multi-headword anchors", () => {
  const { tree } = transform(`
## Part I — Earliest

- **dukkha** / **duḥkha** — unsatisfactory.
- **dukkha** — duplicate in the same section.
`)

  assert.deepEqual(anchorIds(tree).sort(), [
    "duhkha",
    "dukkha",
    "part-i",
    "part-i-duhkha",
    "part-i-dukkha",
    "part-i-dukkha-2",
  ])
})

test("links bare and section-qualified inline-code terms", () => {
  const { tree } = transform(`
## Part I — Earliest

- **dukkha** — unsatisfactory.

## Part VII — Dependent Origination

### VII.a Twelve Links

- **dukkha** — duplicate section sense.

Bare \`dukkha\`; explicit \`dukkha@VII.a\`; adjacent \`dukkha\` (VII.a).
`)

  const termLinks = links(tree).filter((link) => link.text === "dukkha")
  assert.deepEqual(
    termLinks.map((link) => link.url),
    ["#dukkha", "#part-vii-a-dukkha", "#part-vii-a-dukkha"],
  )
})

test("links validated section references and index entries", () => {
  const { tree } = transform(`
## Part I — Earliest

- **dukkha** — unsatisfactory; see II.a, Part VII, under VIII.a, at VIII.g, and below III.

## Part II — Goal

### II.a Subsection

- **nibbāna** — goal.

## Part VII — Dependent Origination

## Part VIII — Path

### VIII.a Subsection

### VIII.g Subsection

## Index

### D

- **dukkha** — I, II.a
`)

  const found = links(tree)
  assert(found.some((link) => link.text === "II.a" && link.url === "#part-ii-a"))
  assert(found.some((link) => link.text === "VII" && link.url === "#part-vii"))
  assert(found.some((link) => link.text === "VIII.a" && link.url === "#part-viii-a"))
  assert(found.some((link) => link.text === "VIII.g" && link.url === "#part-viii-g"))
  assert(found.every((link) => !/\b(?:under|at|see|Part)\b/.test(link.text)))
  assert(found.some((link) => link.text === "III" && link.url === "#part-iii") === false)
  assert(found.some((link) => link.text === "dukkha" && link.url === "#dukkha"))
  assert(found.some((link) => link.text === "I" && link.url === "#part-i"))
})

test("exports a deduplicated, diacritic-folded headword index", () => {
  const { file } = transform(`
## Part I — Earliest

- **dukkha** / **duḥkha** — unsatisfactory.
- **dukkha** — duplicate in the same section.

## Part VII — Dependent Origination

### VII.a Twelve Links

- **viññāṇa** — consciousness.
`)

  const headwords = file.data.glossaryHeadwords ?? []

  // One entry per unique slug (the twice-listed "dukkha" is collapsed), sorted by slug.
  // Multi-headword entries share the single gloss line that follows them.
  assert.deepEqual(headwords, [
    { headword: "duḥkha", slug: "duhkha", part: "I", gloss: "unsatisfactory" },
    { headword: "dukkha", slug: "dukkha", part: "I", gloss: "unsatisfactory" },
    { headword: "viññāṇa", slug: "vinnana", part: "VII.a", gloss: "consciousness" },
  ])

  // Slugs are unique and each is the ASCII fold of its headword (the jump anchor).
  const slugs = headwords.map((h) => h.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const { headword, slug } of headwords) {
    assert.equal(slug, asciiSlug(headword))
    assert.ok(slug.length > 0)
  }
})

test("indexes glosses without their italic rendering notes", () => {
  const { file } = transform(`
## Part III — The Gradual Training

- **sīla** (Skt: śīla) — virtue, ethical conduct, morality. _DN 2 expounds in three sub-sections._
- **sati-sampajañña** — mindfulness and clear comprehension; _expanded as the satipaṭṭhāna training in IV._
- **taṇhā** — craving; lit. "thirst" (cognate with English _thirst_). _Sn 4 target._
- **vimutti** — _the liberation event itself; named from two sides._
- **saṅkhāra** — a very long gloss that keeps going well past any reasonable length for a single search result line, and therefore has to be cut short somewhere sensible before it is handed to the client.
`)

  const bySlug = new Map((file.data.glossaryHeadwords ?? []).map((h) => [h.slug, h]))

  // The terse gloss is kept; the trailing italic note is not.
  assert.equal(bySlug.get("sila")?.gloss, "virtue, ethical conduct, morality")

  // A note introduced by a semicolon is still a note.
  assert.equal(bySlug.get("sati-sampajanna")?.gloss, "mindfulness and clear comprehension")

  // Italics *inside* a clause are cited words, not a note, so the gloss runs on.
  assert.equal(bySlug.get("tanha")?.gloss, 'craving; lit. "thirst" (cognate with English thirst)')

  // Entries whose whole gloss lives inside the italic note fall back to it.
  assert.equal(bySlug.get("vimutti")?.gloss, "the liberation event itself; named from two sides")

  const long = bySlug.get("sankhara")?.gloss ?? ""
  assert.ok(long.endsWith("…"))
  assert.ok(long.length <= 151)
})

test("filters glossary toc to parts, roman subparts, and index", () => {
  const { file } = transform(`
## Part I — Earliest

### Sanskrit-stratum

### I.a Listed Subsection

## Index

### A
`)

  assert.deepEqual(file.data.toc, [
    { depth: 0, text: "Part I — Earliest", slug: "part-i" },
    { depth: 1, text: "I.a Listed Subsection", slug: "part-i-a" },
    { depth: 0, text: "Index", slug: "index" },
  ])
})
