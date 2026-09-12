import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import type { Heading, Link, Root, Text } from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"

import { applyGlossaryTransforms, asciiSlug, type GlossaryHeadword } from "./glossary-transforms"
import { indexGlossaryEntries, searchGlossary } from "./glossary-search"

function transform(markdown: string) {
  const tree = unified().use(remarkParse).parse(markdown) as Root
  const file = {
    data: {} as {
      toc?: Array<{ depth: number; text: string; slug: string }>
      glossaryHeadwords?: GlossaryHeadword[]
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

test("deduplicates identical entries while retaining legacy first-occurrence targets", () => {
  const { file } = transform(`
## Part I — Earliest

- **dukkha** / **duḥkha** — unsatisfactory.
- **dukkha** — unsatisfactory.

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

test("keeps homographs and section senses separate in search, index links, and inline links", () => {
  const { file, tree } = transform(`
## Part I — Early

- **upadhi** — acquisition.
- **dhamma** — teaching.

## Part XIV — Comparatives

### XIV.a Vedānta

- **upādhi** — limiting adjunct.
- **dhamma** — another contextual sense.

See \`upādhi\`, \`upadhi\`, and \`dhamma\` (XIV.a).

## Index

- **upādhi** — XIV.a
- **upadhi** — I
`)
  const entries = indexGlossaryEntries(file.data.glossaryHeadwords ?? [])
  const result = searchGlossary(entries, "upādhi")[0]
  assert.equal(result.entry.slug, "part-xiv-a-upadhi")
  assert.equal(searchGlossary(entries, "upadhi")[0].entry.slug, "upadhi")
  assert.equal(searchGlossary(entries, "limiting adjunct")[0].entry.headword, "upādhi")
  assert.equal(searchGlossary(entries, "dhamma").length, 2)
  assert(
    links(tree)
      .filter((link) => link.text === "upādhi")
      .every((link) => link.url === "#part-xiv-a-upadhi"),
  )
  assert(links(tree).some((link) => link.text === "dhamma" && link.url === "#part-xiv-a-dhamma"))
  for (const entry of entries) assert(anchorIds(tree).includes(entry.slug))
})

test("maps positional glosses and equivalents without splitting synonyms or quoted etymologies", () => {
  const { file } = transform(`
## Part I — Terms

- **lobha** (Skt: same) / **dosa** (Skt: dveṣa) / **moha** (Skt: same) — greed / hatred / delusion.
- **kusala** / **akusala** — wholesome / unwholesome (alt. skillful / unskillful).
- **pasāda** / **pasāda-rūpa** (Skt: prasāda / prasāda-rūpa) — sensitive matter, sensitive material; lit. "clarity / translucence".
- **svasaṃvedana** / **svasaṃvitti** — reflexive cognition, self-awareness.
`)
  const entries = file.data.glossaryHeadwords ?? []
  const get = (term: string) => entries.find((entry) => entry.headword === term)!
  assert.equal(get("lobha").gloss, "greed")
  assert.equal(get("dosa").gloss, "hatred")
  assert.deepEqual(get("dosa").aliases, ["dveṣa"])
  assert.equal(get("moha").gloss, "delusion")
  assert.equal(get("kusala").gloss, "wholesome (alt. skillful)")
  assert.equal(get("akusala").gloss, "unwholesome (alt. unskillful)")
  assert.equal(get("pasāda").gloss, get("pasāda-rūpa").gloss)
  assert.deepEqual(get("pasāda-rūpa").aliases, ["prasāda-rūpa"])
  assert.equal(get("svasaṃvedana").gloss, get("svasaṃvitti").gloss)
})

test("indexes conventional-rendering aliases without indexing later argumentative quotations", () => {
  const { file } = transform(`
## Part III — Meditation

- **samādhi** (Skt: same) — composure. _Standardly "concentration." Later examples include "unrelated phrase"._
- **jhāna** (Skt: dhyāna) — meditation. _Standardly "meditative absorption," "absorption," or left as "jhāna." Further prose._
- **sammā-diṭṭhi** (Skt: samyag-dṛṣṭi) — proper view. _Standardly "right view". A note._
`)
  const entries = indexGlossaryEntries(file.data.glossaryHeadwords ?? [])
  assert.equal(searchGlossary(entries, "concentration")[0].entry.headword, "samādhi")
  assert.equal(searchGlossary(entries, "right view")[0].entry.headword, "sammā-diṭṭhi")
  assert.equal(searchGlossary(entries, "dhyana")[0].entry.headword, "jhāna")
  assert.equal(searchGlossary(entries, "meditative absorption")[0].entry.headword, "jhāna")
  assert.deepEqual(searchGlossary(entries, "unrelated phrase"), [])
  assert.deepEqual(searchGlossary(entries, "   "), [])
})

test("the current glossary resolves the reviewed lookups to real, distinct entry anchors", () => {
  const source = readFileSync(new URL("../content/dhamma/glossary.md", import.meta.url), "utf8")
  const { file, tree } = transform(source)
  const entries = indexGlossaryEntries(file.data.glossaryHeadwords ?? [])
  for (const [query, term, part] of [
    ["upādhi", "upādhi", "XIV.a"],
    ["limiting adjunct", "upādhi", "XIV.a"],
    ["nirvāṇa", "nibbāna", "II"],
    ["concentration", "samādhi", "III.c"],
    ["right view", "sammā-diṭṭhi", "VIII.a"],
  ]) {
    assert(
      searchGlossary(entries, query).some(
        ({ entry }) => entry.headword === term && entry.part === part,
      ),
      query,
    )
  }
  const hatred = searchGlossary(entries, "hatred").map(({ entry }) => entry.headword)
  assert.equal(hatred[0], "dosa")
  assert.equal(searchGlossary(entries, "nirvāṇa")[0].entry.headword, "nibbāna")
  assert(hatred.includes("dosa"))
  assert(!hatred.includes("lobha"))
  assert(!hatred.includes("moha"))
  const ids = anchorIds(tree)
  assert.equal(ids.length, new Set(ids).size, "anchor IDs must be unique")
  for (const entry of entries) assert(ids.includes(entry.slug), entry.slug)

  const pdfTree = unified().use(remarkParse).parse(source) as Root
  applyGlossaryTransforms(pdfTree, { slug: "dhamma/glossary", emitPandocAnchors: true })
  const pdfAnchors = new Set<string>()
  visit(pdfTree, "html", (node) => {
    const id = node.value.match(/^\[\]\{#([^}]+)\}$/)?.[1]
    if (id) pdfAnchors.add(id)
  })
  for (const entry of entries) assert(pdfAnchors.has(entry.slug), entry.slug)
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
