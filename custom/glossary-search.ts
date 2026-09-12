import type { GlossaryHeadword } from "./glossary-transforms"

export interface IndexedEntry extends GlossaryHeadword {
  key: string
  glossKey: string
  aliasKeys: string[]
}

export interface GlossaryMatch {
  entry: IndexedEntry
  rank: number
  headwordIndex: number
  glossIndex: number
  aliasIndex: number
  aliasMatchIndex: number
}

export function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function indexGlossaryEntries(entries: GlossaryHeadword[]): IndexedEntry[] {
  return entries.map((entry) => ({
    ...entry,
    key: fold(entry.headword),
    glossKey: fold(entry.gloss),
    aliasKeys: (entry.aliases ?? []).map(fold),
  }))
}

export function searchGlossary(
  entries: IndexedEntry[],
  input: string,
  limit = 12,
): GlossaryMatch[] {
  const query = fold(input.trim())
  if (!query) return []
  const spelling = input.trim().normalize("NFC").toLowerCase()
  const matches: GlossaryMatch[] = []
  for (const entry of entries) {
    const headwordIndex = entry.key.indexOf(query)
    let aliasIndex = -1
    let aliasRank = Infinity
    entry.aliasKeys.forEach((alias, index) => {
      const position = alias.indexOf(query)
      if (position < 0) return
      const rank = alias === query ? 3 : position === 0 ? 4 : 5
      if (rank < aliasRank) {
        aliasRank = rank
        aliasIndex = index
      }
    })
    const aliasMatchIndex = aliasIndex < 0 ? -1 : entry.aliasKeys[aliasIndex].indexOf(query)
    const glossIndex = entry.glossKey.indexOf(query)
    if (headwordIndex < 0 && aliasIndex < 0 && glossIndex < 0) continue

    // Exact spelling wins over its diacritic-folded homographs; all headword
    // matches precede alias matches, which in turn precede gloss-only matches.
    const exact = entry.headword.normalize("NFC").toLowerCase() === spelling
    const rank = exact
      ? 0
      : headwordIndex === 0
        ? 1
        : headwordIndex > 0
          ? 2
          : aliasIndex >= 0
            ? aliasRank
            : entry.glossKey === query
              ? 6
              : 7
    matches.push({ entry, rank, headwordIndex, glossIndex, aliasIndex, aliasMatchIndex })
  }
  return matches
    .sort((a, b) => a.rank - b.rank || a.entry.headword.localeCompare(b.entry.headword))
    .slice(0, limit)
}
