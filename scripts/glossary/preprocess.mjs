#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { unified } from "unified"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"

import { applyGlossaryTransforms } from "../../custom/glossary-transforms.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..", "..")
const sourcePath = resolve(repoRoot, "content/dhamma/glossary.md")
const outPath = process.argv[2]

const source = readFileSync(sourcePath, "utf-8").replace(
  /<!-- pdf:skip-start -->[\s\S]*?<!-- pdf:skip-end -->\s*/g,
  "",
)

const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]).use(remarkGfm)
const tree = parser.parse(source)

applyGlossaryTransforms(tree, {
  slug: "dhamma/glossary",
  emitPandocAnchors: true,
})

const out = unified()
  .use(remarkStringify, {
    bullet: "-",
    emphasis: "_",
    fences: true,
    listItemIndent: "one",
    rule: "-",
    strong: "*",
  })
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm)
  .stringify(tree)

if (outPath) {
  writeFileSync(outPath, out, "utf-8")
} else {
  process.stdout.write(out)
}
