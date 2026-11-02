import assert from "node:assert/strict"
import test from "node:test"
import { GLOSSARY_SLUG, glossaryTermCount, isGlossary } from "./glossary"
import type { QuartzPluginData } from "../quartz/plugins/vfile"

const file = (slug: string, headwords?: string[]) =>
  ({
    slug,
    glossaryHeadwords: headwords?.map((headword) => ({ headword, slug: headword })),
  }) as unknown as QuartzPluginData

test("isGlossary recognizes only the glossary page", () => {
  assert.equal(isGlossary({ fileData: file(GLOSSARY_SLUG) }), true)
  assert.equal(isGlossary({ fileData: file("dhamma/index") }), false)
  assert.equal(isGlossary({ fileData: file("index") }), false)
})

test("glossaryTermCount counts distinct headwords across Unicode forms", () => {
  const composed = "mettā"
  const decomposed = composed.normalize("NFD")
  const files = [file("index"), file(GLOSSARY_SLUG, [composed, decomposed, "karuṇā"])]
  assert.equal(glossaryTermCount(files), 2)
})

test("glossaryTermCount is undefined without a glossary or its headwords", () => {
  assert.equal(glossaryTermCount([file("index")]), undefined)
  assert.equal(glossaryTermCount([file(GLOSSARY_SLUG)]), undefined)
})
