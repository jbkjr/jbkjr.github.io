import type {
  Heading,
  Html,
  InlineCode,
  Link,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
  Text,
} from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"

const GLOSSARY_SLUG = "dhamma/glossary"
const HEADING_ATTRIBUTE_RE = /\s+\{[^}]*\}\s*$/
const ROMAN_REFS = [
  "XIII",
  "XIV",
  "XII",
  "XI",
  "XV",
  "VIII",
  "VII",
  "III",
  "VI",
  "IV",
  "IX",
  "II",
  "X",
  "V",
  "I",
]
const SECTION_REF_RE = new RegExp(`\\b(?:${ROMAN_REFS.join("|")})(?:\\.[a-z])?\\b`, "g")
const GENERAL_SECTION_REF_RE = new RegExp(
  `\\b(?:Part|cf\\.|see|at|under|within|below|above)\\s+(${ROMAN_REFS.join(
    "|",
  )})(?:\\.([a-z]))?\\b|\\b((?:${ROMAN_REFS.join("|")})\\.[a-z])\\b`,
  "g",
)
const STANDALONE_SECTION_REF_RE = /\b(XIII|XIV|XII|XI|XV|VIII|VII|VI|IV|IX|III|II)\b/g
const EXPLICIT_TERM_REF_RE = /^(.+?)@([IVX]+(?:\.[a-z])?)$/
const SECTION_QUALIFIER_RE = /^\s*\(([IVX]+(?:\.[a-z])?)\)/

// Longest gloss kept in the client-side search index. Entries whose gloss runs
// past this are truncated with an ellipsis — the index is for finding an entry,
// not for reading it.
const GLOSS_MAX_LENGTH = 150

const UNLISTED_HEADING_TEXT = new Set([
  "Sanskrit-stratum",
  "Tibetan (Dzogchen / Mahāmudrā)",
  "Vedānta",
  "Sāṅkhya / Yoga",
  "Epistemology (pan-Indic)",
  "Ethics / Other",
  "Greek",
  "Hebrew (Kabbalah)",
  "German",
])

export interface TransformOptions {
  slug: string
  emitPandocAnchors?: boolean
}

interface TocEntry {
  depth: number
  text: string
  slug: string
}

interface HeadingRecord extends TocEntry {
  listed: boolean
  sourceDepth: number
}

interface EntryRecord {
  headword: string
  slug: string
  partAnchor: string
  partLabel: string
  gloss: string
  aliases: string[]
  qualifiedSlug: string
  paragraph: Paragraph
  strong: PhrasingContent
  listItem: ListItem
  isFirstOccurrence: boolean
}

interface HeadwordCollection {
  bySlug: Map<string, EntryRecord[]>
  canonical: Map<string, string>
}

export interface GlossaryHeadword {
  headword: string
  slug: string
  /** Section label of the entry's home Part, e.g. "III.a" or "XII". */
  part: string
  /** The gloss following the headword's em-dash, truncated for the index. */
  gloss: string
  /** Equivalent headwords and conventional English renderings. */
  aliases?: string[]
}

interface WalkState {
  inCode: boolean
  inHeading: boolean
  inIndex: boolean
  inLink: boolean
}

export function applyGlossaryTransforms(
  tree: Root,
  options: TransformOptions,
  file?: Pick<VFile, "data">,
): void {
  if (options.slug !== GLOSSARY_SLUG) return

  const emitPandocAnchors = options.emitPandocAnchors ?? false
  const headings = applyHeadingTargets(tree, emitPandocAnchors)
  updateTableOfContents(file, headings)

  const collection = collectHeadwords(tree)
  updateHeadwordIndex(file, collection)
  injectEntryAnchors(collection, emitPandocAnchors)
  linkIndex(tree, collection)
  linkTerms(tree, collection)
  linkSectionReferencesInTree(tree, sectionMapFromHeadings(headings))
}

function applyHeadingTargets(tree: Root, emitPandocAnchors: boolean): HeadingRecord[] {
  const headings: HeadingRecord[] = []
  let inIndex = false

  visit(tree, "heading", (node: Heading) => {
    const text = cleanHeadingText(mdastToString(node))
    const label = labelFromHeadingText(text)
    const id = label ? sectionId(label) : undefined
    const listed = Boolean(label) && node.depth <= 3
    const shouldUnlist = !listed && node.depth === 3 && (inIndex || UNLISTED_HEADING_TEXT.has(text))

    if (id) {
      headings.push({
        depth: 0,
        sourceDepth: node.depth,
        text,
        slug: id,
        listed,
      })
      if (emitPandocAnchors) {
        appendHeadingAttributes(node, `#${id}`)
      } else {
        setHProperty(node, "id", id)
      }
    }

    if (emitPandocAnchors && shouldUnlist) {
      appendHeadingAttributes(node, ".unlisted .unnumbered")
    }

    if (label === "Index") {
      inIndex = true
      addHClass(node, "glossary-index-heading")
    } else if (node.depth === 2 && label) {
      inIndex = false
    }
  })

  return headings
}

function updateTableOfContents(file: Pick<VFile, "data"> | undefined, headings: HeadingRecord[]) {
  if (!file) return

  const listed = headings.filter((heading) => heading.listed)
  if (listed.length === 0) return

  const highestDepth = Math.min(...listed.map((heading) => heading.sourceDepth))
  file.data.toc = listed.map((heading) => ({
    depth: heading.sourceDepth - highestDepth,
    text: heading.text,
    slug: heading.slug,
  })) as TocEntry[]
}

function updateHeadwordIndex(
  file: Pick<VFile, "data"> | undefined,
  collection: HeadwordCollection,
): void {
  if (!file) return

  const headwords: GlossaryHeadword[] = []
  const seen = new Set<string>()
  for (const [slug, records] of collection.bySlug) {
    for (const record of records) {
      // Folding is for lookup, not lexical identity: upadhi and upādhi, and
      // the same headword used in different sections, must remain distinct.
      const identity = JSON.stringify([
        record.headword.normalize("NFC"),
        record.partLabel,
        record.gloss,
      ])
      if (seen.has(identity)) continue
      seen.add(identity)
      headwords.push({
        headword: record.headword,
        slug: record.isFirstOccurrence ? slug : record.qualifiedSlug,
        part: record.partLabel,
        gloss: truncateGloss(record.gloss),
        ...(record.aliases.length ? { aliases: record.aliases } : {}),
      })
    }
  }
  headwords.sort((a, b) => asciiSlug(a.headword).localeCompare(asciiSlug(b.headword)))
  file.data.glossaryHeadwords = headwords
}

function sectionMapFromHeadings(headings: HeadingRecord[]): Map<string, string> {
  const sections = new Map<string, string>()
  for (const heading of headings) {
    const label = labelFromHeadingText(heading.text)
    if (label) sections.set(label, heading.slug)
  }
  return sections
}

function collectHeadwords(tree: Root): HeadwordCollection {
  const bySlug = new Map<string, EntryRecord[]>()
  const canonical = new Map<string, string>()
  const usedQualifiedSlugs = new Set<string>()
  let currentPartAnchor: string | undefined
  let currentPartLabel = ""
  let inIndex = false

  visit(tree, (node) => {
    if (node.type === "heading") {
      const heading = node as Heading
      const text = cleanHeadingText(mdastToString(heading))
      const label = labelFromHeadingText(text)

      if (label === "Index") {
        inIndex = true
        currentPartAnchor = undefined
        currentPartLabel = ""
      } else if (heading.depth === 2 && label) {
        inIndex = false
        currentPartAnchor = sectionId(label)
        currentPartLabel = label
      } else if (heading.depth === 3 && label && !inIndex) {
        currentPartAnchor = sectionId(label)
        currentPartLabel = label
      }
      return
    }

    if (inIndex || node.type !== "listItem" || !currentPartAnchor) return

    const listItem = node as ListItem
    const paragraph = findFirstParagraph(listItem)
    if (!paragraph) return

    const gloss = glossFromParagraph(paragraph)
    const strongNodes = findHeadwordStrongNodes(paragraph)
    const glosses = positionalGlosses(gloss, strongNodes.length)
    const aliases = aliasesFromParagraph(paragraph, strongNodes)

    for (const [index, strong] of strongNodes.entries()) {
      const headword = cleanTerm(mdastToString(strong))
      const slug = asciiSlug(headword)
      if (!headword || !slug) continue

      let qualifiedSlug = `${currentPartAnchor}-${slug}`
      let counter = 1
      while (usedQualifiedSlugs.has(qualifiedSlug)) {
        counter += 1
        qualifiedSlug = `${currentPartAnchor}-${slug}-${counter}`
      }
      usedQualifiedSlugs.add(qualifiedSlug)

      const isFirstOccurrence = !canonical.has(slug)
      const record: EntryRecord = {
        headword,
        slug,
        partAnchor: currentPartAnchor,
        partLabel: currentPartLabel,
        gloss: glosses[index],
        aliases: aliases[index],
        qualifiedSlug,
        paragraph,
        strong,
        listItem,
        isFirstOccurrence,
      }

      const records = bySlug.get(slug) ?? []
      records.push(record)
      bySlug.set(slug, records)
      if (isFirstOccurrence) canonical.set(slug, slug)
    }
  })

  for (const [slug, records] of bySlug) {
    const canonicalTarget = canonical.get(slug)
    for (const record of records) {
      record.isFirstOccurrence = record.slug === canonicalTarget && record === records[0]
    }
  }

  return { bySlug, canonical }
}

function injectEntryAnchors(collection: HeadwordCollection, emitPandocAnchors: boolean): void {
  const byParagraph = new Map<Paragraph, Map<PhrasingContent, string[]>>()

  for (const records of collection.bySlug.values()) {
    for (const record of records) {
      addHClass(record.listItem, "glossary-entry")
      addHClass(record.strong, "glossary-headword")

      const ids = [record.qualifiedSlug]
      if (record.isFirstOccurrence) ids.unshift(record.slug)

      const anchorsByStrong =
        byParagraph.get(record.paragraph) ?? new Map<PhrasingContent, string[]>()
      anchorsByStrong.set(record.strong, ids)
      byParagraph.set(record.paragraph, anchorsByStrong)
    }
  }

  for (const [paragraph, anchorsByStrong] of byParagraph) {
    const nextChildren: PhrasingContent[] = []
    for (const child of paragraph.children) {
      for (const id of anchorsByStrong.get(child) ?? []) {
        nextChildren.push(makeAnchorNode(id, emitPandocAnchors))
      }
      nextChildren.push(child)
    }
    paragraph.children = nextChildren
  }
}

function linkIndex(tree: Root, collection: HeadwordCollection): void {
  let inIndex = false

  visit(tree, (node) => {
    if (node.type === "heading") {
      const label = labelFromHeadingText(cleanHeadingText(mdastToString(node as Heading)))
      if (label === "Index") {
        inIndex = true
      } else if ((node as Heading).depth === 2 && label) {
        inIndex = false
      }
      return
    }

    if (!inIndex || node.type !== "listItem") return
    const listItem = node as ListItem
    addHClass(listItem, "glossary-index-entry")
    linkIndexChildren(listItem.children, collection)
  })
}

function linkIndexChildren(
  children: (RootContent | PhrasingContent)[],
  collection: HeadwordCollection,
): void {
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]
    if (child.type === "strong") {
      const term = cleanTerm(mdastToString(child))
      const record = recordsForTerm(term, collection)?.[0]
      const target = record && (record.isFirstOccurrence ? record.slug : record.qualifiedSlug)
      if (target) {
        children[index] = makeLinkNode(`#${target}`, "glossary-index-term", [
          child,
        ]) as unknown as typeof child
      }
      continue
    }

    if (isParent(child)) {
      linkIndexChildren(child.children as PhrasingContent[], collection)
    }
  }
}

function linkTerms(tree: Root, collection: HeadwordCollection): void {
  linkTermsInChildren(tree.children, collection, {
    inCode: false,
    inHeading: false,
    inIndex: false,
    inLink: false,
  })
}

function linkTermsInChildren(
  children: (RootContent | PhrasingContent)[],
  collection: HeadwordCollection,
  state: WalkState,
): void {
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]
    const childState = stateForChild(child, state)

    if (child.type === "inlineCode" && !state.inHeading && !state.inLink) {
      const resolved = resolveTermReference(child, children[index + 1], collection)
      if (resolved) {
        const code = child as InlineCode
        code.value = resolved.display
        addHClass(code, "glossary-inline-term")
        children[index] = makeLinkNode(`#${resolved.target}`, "glossary-term-link", [
          code,
        ]) as unknown as typeof child
      }
      continue
    }

    if (isParent(child)) {
      linkTermsInChildren(child.children as PhrasingContent[], collection, childState)
    }
  }
}

function resolveTermReference(
  code: InlineCode,
  nextSibling: RootContent | PhrasingContent | undefined,
  collection: HeadwordCollection,
): { display: string; target: string } | undefined {
  const explicit = parseExplicitTermReference(code.value)
  const slug = asciiSlug(explicit.term)
  const records = recordsForTerm(explicit.term, collection)
  if (!records || records.length === 0) return undefined

  const requestedSection = explicit.section ?? sectionQualifierFromSibling(nextSibling)
  if (requestedSection) {
    const requestedPartAnchor = sectionId(requestedSection)
    const sectionRecord = records.find((record) => record.partAnchor === requestedPartAnchor)
    if (sectionRecord) {
      return { display: explicit.term, target: sectionRecord.qualifiedSlug }
    }
  }

  return {
    display: explicit.term,
    target: records[0].isFirstOccurrence ? slug : records[0].qualifiedSlug,
  }
}

function recordsForTerm(term: string, collection: HeadwordCollection): EntryRecord[] | undefined {
  const records = collection.bySlug.get(asciiSlug(term))
  const exact = records?.filter(
    (record) => record.headword.normalize("NFC") === term.normalize("NFC"),
  )
  return exact?.length ? exact : records
}

function linkSectionReferencesInTree(tree: Root, sections: Map<string, string>): void {
  linkSectionReferencesInChildren(tree.children, sections, {
    inCode: false,
    inHeading: false,
    inIndex: false,
    inLink: false,
  })
}

function linkSectionReferencesInChildren(
  children: (RootContent | PhrasingContent)[],
  sections: Map<string, string>,
  state: WalkState,
): void {
  let currentState = { ...state }

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]
    if (child.type === "heading") {
      const label = labelFromHeadingText(cleanHeadingText(mdastToString(child as Heading)))
      if (label === "Index") {
        currentState = { ...currentState, inIndex: true }
      } else if ((child as Heading).depth === 2 && label) {
        currentState = { ...currentState, inIndex: false }
      }
    }

    if (
      child.type === "text" &&
      child.value !== "" &&
      (child.data as { hName?: string } | undefined)?.hName !== "span" &&
      !currentState.inCode &&
      !currentState.inHeading &&
      !currentState.inLink
    ) {
      const linked = currentState.inIndex
        ? linkIndexSectionReferences(child.value, sections)
        : linkGeneralSectionReferences(child.value, sections)
      children.splice(index, 1, ...(linked as (typeof child)[]))
      index += linked.length - 1
      continue
    }

    if (isParent(child)) {
      linkSectionReferencesInChildren(
        child.children as PhrasingContent[],
        sections,
        stateForChild(child, currentState),
      )
    }
  }
}

function linkGeneralSectionReferences(
  value: string,
  sections: Map<string, string>,
): PhrasingContent[] {
  const linked = linkSectionReferenceMatches(
    value,
    sections,
    GENERAL_SECTION_REF_RE,
    (match) => {
      if (match[1]) return match[2] ? `${match[1]}.${match[2]}` : match[1]
      return match[3]
    },
    {
      getText: (_match, label) => label,
    },
  )

  return linked.flatMap((child) => {
    if (child.type !== "text") return [child]
    return linkSectionReferenceMatches(
      child.value,
      sections,
      STANDALONE_SECTION_REF_RE,
      (match) => match[1],
      {
        shouldLink: shouldLinkStandaloneSectionRef,
      },
    )
  })
}

function linkIndexSectionReferences(
  value: string,
  sections: Map<string, string>,
): PhrasingContent[] {
  return linkSectionReferenceMatches(value, sections, SECTION_REF_RE, (match) => match[0])
}

function linkSectionReferenceMatches(
  value: string,
  sections: Map<string, string>,
  regex: RegExp,
  getLabel: (match: RegExpMatchArray) => string,
  options: {
    getText?: (match: RegExpMatchArray, label: string) => string
    shouldLink?: (match: RegExpMatchArray, start: number, value: string) => boolean
  } = {},
): PhrasingContent[] {
  const linked: PhrasingContent[] = []
  let lastIndex = 0

  for (const match of value.matchAll(regex)) {
    const label = getLabel(match)
    const id = sections.get(label)
    const start = match.index ?? 0
    const shouldLink = options.shouldLink ?? (() => true)
    if (!id || !shouldLink(match, start, value)) continue

    const text = match[0]
    const linkText = options.getText?.(match, label) ?? text
    const linkOffset = Math.max(0, text.lastIndexOf(linkText))
    const linkStart = start + linkOffset

    if (linkStart > lastIndex) {
      linked.push({ type: "text", value: value.slice(lastIndex, linkStart) })
    }

    if (linkText.startsWith("(") && linkText.endsWith(")")) {
      linked.push({ type: "text", value: "(" })
      linked.push(makeLinkNode(`#${id}`, "glossary-section-ref", [{ type: "text", value: label }]))
      linked.push({ type: "text", value: ")" })
    } else {
      linked.push(
        makeLinkNode(`#${id}`, "glossary-section-ref", [{ type: "text", value: linkText }]),
      )
    }
    lastIndex = start + text.length
  }

  if (lastIndex === 0) return [{ type: "text", value }]
  if (lastIndex < value.length) {
    linked.push({ type: "text", value: value.slice(lastIndex) })
  }
  return linked
}

function shouldLinkStandaloneSectionRef(
  match: RegExpMatchArray,
  start: number,
  value: string,
): boolean {
  const before = value.slice(Math.max(0, start - 24), start)
  const after = value.slice(start + match[0].length, start + match[0].length + 20)
  const beforeLooksReferential =
    /(?:cf\.|see|under|at|in|to|from|within|below|above)\s+$/i.test(before) ||
    /[(,;/—]\s*$/.test(before)
  const afterLooksReferential = /^\s*(?:[(,);./]|for\b|as\b|and\b|or\b|$)/i.test(after)
  return beforeLooksReferential && afterLooksReferential
}

function findFirstParagraph(listItem: ListItem): Paragraph | undefined {
  return listItem.children.find((child): child is Paragraph => child.type === "paragraph")
}

function findHeadwordStrongNodes(paragraph: Paragraph): PhrasingContent[] {
  const headwords: PhrasingContent[] = []
  let sawHeadword = false

  for (const child of paragraph.children) {
    if (child.type === "text") {
      if (child.value.includes("—")) break
      if (!sawHeadword && child.value.trim() !== "") return []
      continue
    }

    if (child.type === "strong") {
      const headword = cleanTerm(mdastToString(child))
      if (headword !== "") {
        headwords.push(child)
        sawHeadword = true
      }
    }
  }

  return headwords
}

// An italic run starts a rendering-note when the gloss before it has already
// closed — i.e. it follows sentence-or-clause punctuation, or the em-dash
// itself. Italics *inside* a clause are cited words (`cognate with English
// _thirst_`) and belong to the gloss.
const NOTE_BOUNDARY_RE = /[.!?;:—–]\s*$/

/**
 * Pull the gloss out of an entry paragraph — the text after the headword's
 * em-dash, up to where the italic rendering-note begins.
 *
 * Entries read `**headword** (Skt: …) — gloss; _note._` A handful put the whole
 * gloss inside the note (`**vimutti** (II) — _the liberation event itself…_`);
 * there the note-boundary check trips on the em-dash, leaving nothing before
 * the note, and the full paragraph text is used instead.
 */
function glossFromParagraph(paragraph: Paragraph): string {
  let beforeNote = ""
  let full = ""
  let inNote = false

  for (const child of paragraph.children) {
    const text = mdastToString(child)
    if (child.type === "emphasis" && NOTE_BOUNDARY_RE.test(beforeNote)) inNote = true
    if (!inNote) beforeNote += text
    full += text
  }

  return glossAfterDash(beforeNote) || glossAfterDash(full)
}

function glossAfterDash(text: string): string {
  const dash = text.indexOf("—")
  if (dash === -1) return ""

  return cleanTerm(text.slice(dash + 1)).replace(/[;,.]+$/, "")
}

function truncateGloss(gloss: string): string {
  if (gloss.length <= GLOSS_MAX_LENGTH) return gloss
  return `${gloss.slice(0, GLOSS_MAX_LENGTH).trimEnd()}…`
}

// Only top-level spaced slashes map distinct headwords to distinct glosses.
// Slashes in etymologies, quoted phrases, or parenthetical notes do not.
function splitPositional(value: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quoted = false
  let start = 0
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '"') quoted = !quoted
    if (quoted) continue
    if (value[i] === "(") depth++
    if (value[i] === ")") depth--
    if (depth === 0 && value.slice(i, i + 3) === " / ") {
      parts.push(value.slice(start, i).trim())
      start = i + 3
      i += 2
    }
  }
  parts.push(value.slice(start).trim())
  return parts
}

function positionalGlosses(gloss: string, count: number): string[] {
  if (count < 2) return [gloss]
  const alternative = gloss.match(/\s*\(alt\.\s+([^)]*)\)/)
  const main = alternative ? gloss.replace(alternative[0], "") : gloss
  const parts = splitPositional(main)
  if (parts.length !== count) return Array(count).fill(gloss)
  const alternatives = alternative ? splitPositional(alternative[1]) : []
  if (alternative && alternatives.length !== count) return splitPositional(gloss)
  return parts.map((part, index) =>
    alternatives.length === count ? `${part} (alt. ${alternatives[index]})` : part,
  )
}

function aliasesFromParagraph(paragraph: Paragraph, headwords: PhrasingContent[]): string[][] {
  const aliases = headwords.map(() => [] as string[])
  let index = -1
  for (const child of paragraph.children) {
    if (headwords.includes(child)) index++
    if (child.type !== "text") continue
    const beforeDash = child.value.split("—")[0]
    for (const match of beforeDash.matchAll(/\((?:Skt|Pāli|Wylie):\s*([^)]*)\)/g)) {
      if (index < 0) continue
      const terms = match[1].split(/\s+\/\s+/).filter((term) => term !== "same")
      if (index === headwords.length - 1 && terms.length === headwords.length && index > 0) {
        terms.forEach((term, i) => aliases[i].push(term))
      } else {
        aliases[index].push(...terms)
      }
    }
    if (child.value.includes("—")) break
  }

  // The first sentence of a Standardly note contains conventional renderings;
  // later quoted examples and argumentative prose are not search aliases.
  for (const child of paragraph.children) {
    if (child.type !== "emphasis") continue
    const note = mdastToString(child)
    const standard = note.match(/^Standardly\s+(.*?)(?:\.(?:["”]|\s|$)|$)/)?.[1]
    if (!standard) continue
    const terms = [...standard.matchAll(/["“]([^"”]+)(?:["”]|$)/g)].map((match) =>
      match[1].replace(/[.,;]+$/, "").trim(),
    )
    aliases.forEach((list) => list.push(...terms))
  }
  return aliases.map((list, i) =>
    [...new Set(list)].filter((term) => term !== mdastToString(headwords[i])),
  )
}

function parseExplicitTermReference(value: string): { term: string; section?: string } {
  const cleaned = cleanTerm(value)
  const explicit = cleaned.match(EXPLICIT_TERM_REF_RE)
  if (!explicit) return { term: cleaned }
  return {
    term: cleanTerm(explicit[1]),
    section: explicit[2],
  }
}

function sectionQualifierFromSibling(
  sibling: RootContent | PhrasingContent | undefined,
): string | undefined {
  if (!sibling || sibling.type !== "text") return undefined
  return sibling.value.match(SECTION_QUALIFIER_RE)?.[1]
}

function labelFromHeadingText(value: string): string | undefined {
  const text = cleanHeadingText(value)
  if (/^Index\b/i.test(text)) return "Index"
  return text.match(/^Part\s+([IVX]+)\b/)?.[1] ?? text.match(/^([IVX]+\.[a-z])\b/)?.[1]
}

function sectionId(label: string): string {
  return label === "Index" ? "index" : `part-${asciiSlug(label)}`
}

export function asciiSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function cleanHeadingText(value: string): string {
  return value.replace(HEADING_ATTRIBUTE_RE, "").trim()
}

function cleanTerm(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function appendHeadingAttributes(heading: Heading, attributes: string): void {
  const last = heading.children[heading.children.length - 1]
  const suffix = ` {${attributes}}`
  if (last?.type === "text") {
    last.value = `${last.value.replace(HEADING_ATTRIBUTE_RE, "")}${suffix}`
  } else {
    heading.children.push({ type: "text", value: suffix })
  }
}

function makeAnchorNode(id: string, emitPandocAnchor: boolean): PhrasingContent {
  if (emitPandocAnchor) {
    return { type: "html", value: `[]{#${id}}` } as Html
  }

  return {
    type: "text",
    value: "",
    data: {
      hName: "span",
      hProperties: {
        id,
        className: ["glossary-entry-anchor"],
        "aria-hidden": "true",
      },
    },
  } as Text
}

function makeLinkNode(url: string, className: string, children: PhrasingContent[]): Link {
  return {
    type: "link",
    url,
    children,
    data: {
      hProperties: {
        className: [className],
        "data-no-popover": true,
      },
    },
  }
}

function stateForChild(child: RootContent | PhrasingContent, state: WalkState): WalkState {
  return {
    inCode: state.inCode || child.type === "inlineCode" || child.type === "code",
    inHeading: state.inHeading || child.type === "heading",
    inIndex: state.inIndex,
    inLink: state.inLink || child.type === "link",
  }
}

function isParent(
  node: RootContent | PhrasingContent,
): node is (RootContent | PhrasingContent) & { children: (RootContent | PhrasingContent)[] } {
  return Array.isArray((node as { children?: unknown }).children)
}

function setHProperty(node: RootContent | PhrasingContent, key: string, value: unknown): void {
  node.data = node.data ?? {}
  const data = node.data as { hProperties?: Record<string, unknown> }
  data.hProperties = data.hProperties ?? {}
  data.hProperties[key] = value
}

function addHClass(node: RootContent | PhrasingContent, className: string): void {
  node.data = node.data ?? {}
  const data = node.data as { hProperties?: Record<string, unknown> }
  data.hProperties = data.hProperties ?? {}
  const existing = data.hProperties.className
  const classes = Array.isArray(existing)
    ? existing.map(String)
    : typeof existing === "string"
      ? existing.split(/\s+/)
      : []
  if (!classes.includes(className)) classes.push(className)
  data.hProperties.className = classes
}

declare module "vfile" {
  interface DataMap {
    glossaryHeadwords?: GlossaryHeadword[]
  }
}
