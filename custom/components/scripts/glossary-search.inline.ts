interface HeadwordEntry {
  headword: string
  slug: string
  part: string
  gloss: string
}

interface IndexedEntry extends HeadwordEntry {
  key: string
  glossKey: string
}

interface Match {
  entry: HeadwordEntry
  /** Lower sorts first: 0 headword-prefix, 1 headword-substring, 2 gloss. */
  rank: number
  /** Where the query matched, for highlighting. -1 when it matched the gloss. */
  headwordIndex: number
  glossIndex: number
}

const MAX_RESULTS = 12

// Same diacritic folding asciiSlug uses, so ASCII queries (e.g. "vinnana")
// match diacritic headwords ("viññāṇa").
function fold(value: string): string {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

// Builds a text node run with the matched span wrapped in <mark>. Uses
// textContent throughout so indexed content can never inject markup.
function highlighted(text: string, start: number, length: number): DocumentFragment {
  const fragment = document.createDocumentFragment()
  if (start < 0) {
    fragment.append(document.createTextNode(text))
    return fragment
  }

  fragment.append(document.createTextNode(text.slice(0, start)))
  const mark = document.createElement("mark")
  mark.textContent = text.slice(start, start + length)
  fragment.append(mark, document.createTextNode(text.slice(start + length)))
  return fragment
}

function setupContainer(container: Element) {
  const input = container.querySelector<HTMLInputElement>(".glossary-search-bar")
  const results = container.querySelector<HTMLElement>(".glossary-search-results")
  const empty = container.querySelector<HTMLElement>(".glossary-search-empty")
  const dataEl = container.querySelector(".glossary-headword-index")
  if (!input || !results || !dataEl) return

  let entries: IndexedEntry[]
  try {
    const parsed = JSON.parse(dataEl.textContent ?? "[]") as HeadwordEntry[]
    entries = parsed.map((entry) => ({
      ...entry,
      key: fold(entry.headword),
      glossKey: fold(entry.gloss ?? ""),
    }))
  } catch {
    return
  }

  let current: HeadwordEntry[] = []
  let activeIndex = -1

  const clearResults = () => {
    results.replaceChildren()
    if (empty) empty.hidden = true
    current = []
    activeIndex = -1
  }

  const render = (matches: Match[], queryLength: number) => {
    results.replaceChildren()
    current = matches.map((match) => match.entry)
    activeIndex = -1

    for (const { entry, headwordIndex, glossIndex } of matches) {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = `#${entry.slug}`
      a.setAttribute("role", "option")
      a.setAttribute("data-no-popover", "true")

      const headword = document.createElement("span")
      headword.className = "glossary-search-headword"
      headword.append(highlighted(entry.headword, headwordIndex, queryLength))
      a.append(headword)

      if (entry.part) {
        const part = document.createElement("span")
        part.className = "glossary-search-part"
        part.textContent = entry.part
        a.append(part)
      }

      if (entry.gloss) {
        const gloss = document.createElement("span")
        gloss.className = "glossary-search-gloss"
        gloss.append(highlighted(entry.gloss, glossIndex, queryLength))
        a.append(gloss)
      }

      li.append(a)
      results.append(li)
    }
  }

  const setActive = (next: number) => {
    const items = results.querySelectorAll("li")
    if (items.length === 0) return
    activeIndex = (next + items.length) % items.length
    items.forEach((li, i) => li.classList.toggle("active", i === activeIndex))
    items[activeIndex]?.scrollIntoView({ block: "nearest" })
  }

  const onInput = () => {
    const query = fold(input.value.trim())
    if (!query) {
      clearResults()
      return
    }

    // Headword matches always beat gloss matches, so typing a Pāli term never
    // gets pushed down the list by an English gloss that happens to contain it.
    const matches: Match[] = []
    for (const entry of entries) {
      const headwordIndex = entry.key.indexOf(query)
      if (headwordIndex >= 0) {
        matches.push({
          entry,
          rank: headwordIndex === 0 ? 0 : 1,
          headwordIndex,
          glossIndex: -1,
        })
        continue
      }

      const glossIndex = entry.glossKey.indexOf(query)
      if (glossIndex >= 0) {
        matches.push({ entry, rank: 2, headwordIndex: -1, glossIndex })
      }
    }

    matches.sort((a, b) => a.rank - b.rank || a.entry.headword.localeCompare(b.entry.headword))
    const shown = matches.slice(0, MAX_RESULTS)
    render(shown, query.length)
    if (empty) empty.hidden = shown.length > 0
  }

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive(activeIndex + 1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive(activeIndex - 1)
    } else if (e.key === "Enter") {
      const target = activeIndex >= 0 ? current[activeIndex] : current[0]
      if (target) {
        e.preventDefault()
        window.location.hash = target.slug
        clearResults()
        input.blur()
      }
    } else if (e.key === "Escape") {
      clearResults()
      input.blur()
    }
  }

  // Anchors navigate natively on click; clear the dropdown afterward.
  const onResultsClick = () => {
    window.setTimeout(clearResults, 0)
  }

  input.addEventListener("input", onInput)
  input.addEventListener("keydown", onKeydown)
  results.addEventListener("click", onResultsClick)

  window.addCleanup(() => {
    input.removeEventListener("input", onInput)
    input.removeEventListener("keydown", onKeydown)
    results.removeEventListener("click", onResultsClick)
  })
}

// "/" focuses the visible search box, the convention for in-page find. Skipped
// while the caret is already in a field so it stays typable.
function setupShortcut(): void {
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return

    const active = document.activeElement
    if (
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement ||
      (active instanceof HTMLElement && active.isContentEditable)
    ) {
      return
    }

    // Desktop and narrow layouts each render an instance; only one is visible.
    const boxes = document.querySelectorAll<HTMLInputElement>(".glossary-search-bar")
    for (const box of boxes) {
      if (box.offsetParent !== null) {
        e.preventDefault()
        box.focus()
        return
      }
    }
  }

  document.addEventListener("keydown", onKeydown)
  window.addCleanup(() => document.removeEventListener("keydown", onKeydown))
}

// Flash the entry a jump lands on. Deep-linking into a 1,900-line reference
// otherwise drops the reader mid-page with no cue about which line matched.
function setupTargetFlash(): void {
  const flashId = (id: string) => {
    if (!id) return

    const anchor = document.getElementById(id)
    const entry = anchor?.closest(".glossary-entry")
    if (!entry) return

    entry.classList.remove("glossary-entry-flash")
    // Force a reflow so re-clicking the same result replays the animation.
    void (entry as HTMLElement).offsetWidth
    entry.classList.add("glossary-entry-flash")
  }

  const flashFromLocation = () => flashId(decodeURIComponent(window.location.hash.slice(1)))

  // Quartz's SPA router handles same-page anchors with scrollIntoView +
  // pushState, which fires no hashchange — so in-page jumps (search results,
  // the index, cross-references) have to be caught at the click instead.
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.("a")
    if (!link) return

    const href = link.getAttribute("href")
    if (!href?.startsWith("#")) return

    // Synchronously: the router's own handler sits on window, so it scrolls
    // after this one runs either way, and a hidden tab (where rAF never fires)
    // still gets the class applied.
    flashId(decodeURIComponent(href.slice(1)))
  }

  flashFromLocation()
  window.addEventListener("hashchange", flashFromLocation)
  document.addEventListener("click", onClick)

  window.addCleanup(() => {
    window.removeEventListener("hashchange", flashFromLocation)
    document.removeEventListener("click", onClick)
  })
}

function setupGlossarySearch() {
  // Bundled into the site-wide postscript, so this runs on every page/nav — but
  // the boxes only exist on the glossary page. querySelectorAll handles 0, 1
  // (desktop OR mobile) or 2 instances; each is wired independently.
  const containers = document.querySelectorAll(".glossary-search")
  containers.forEach(setupContainer)
  if (containers.length === 0) return

  setupShortcut()
  setupTargetFlash()
}

document.addEventListener("nav", () => {
  setupGlossarySearch()
})
