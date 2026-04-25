import assert from "node:assert/strict"
import test from "node:test"
import type { Heading, Link, Root, Text } from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"

import { applyGlossaryTransforms } from "./glossary-transforms"

function transform(markdown: string) {
  const tree = unified().use(remarkParse).parse(markdown) as Root
  const file = { data: {} as { toc?: Array<{ depth: number; text: string; slug: string }> } }
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

- **dukkha** — unsatisfactory; see II.a, Part VII, and below III.

## Part II — Goal

### II.a Subsection

- **nibbāna** — goal.

## Part VII — Dependent Origination

## Index

### D

- **dukkha** — I, II.a
`)

  const found = links(tree)
  assert(found.some((link) => link.text === "II.a" && link.url === "#part-ii-a"))
  assert(found.some((link) => link.text === "Part VII" && link.url === "#part-vii"))
  assert(found.some((link) => link.text === "III" && link.url === "#part-iii") === false)
  assert(found.some((link) => link.text === "dukkha" && link.url === "#dukkha"))
  assert(found.some((link) => link.text === "I" && link.url === "#part-i"))
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
