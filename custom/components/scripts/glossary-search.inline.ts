interface HeadwordEntry {
  headword: string
  slug: string
}

interface IndexedEntry extends HeadwordEntry {
  key: string
}

const MAX_RESULTS = 12

// Same diacritic folding asciiSlug uses, so ASCII queries (e.g. "vinnana")
// match diacritic headwords ("viññāṇa").
function fold(value: string): string {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

function setupContainer(container: Element) {
  const input = container.querySelector<HTMLInputElement>(".glossary-search-bar")
  const results = container.querySelector<HTMLElement>(".glossary-search-results")
  const dataEl = container.querySelector(".glossary-headword-index")
  if (!input || !results || !dataEl) return

  let entries: IndexedEntry[]
  try {
    const parsed = JSON.parse(dataEl.textContent ?? "[]") as HeadwordEntry[]
    entries = parsed.map((entry) => ({ ...entry, key: fold(entry.headword) }))
  } catch {
    return
  }

  let current: HeadwordEntry[] = []
  let activeIndex = -1

  const clearResults = () => {
    results.replaceChildren()
    current = []
    activeIndex = -1
  }

  const render = (matches: HeadwordEntry[]) => {
    results.replaceChildren()
    current = matches
    activeIndex = -1
    for (const match of matches) {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = `#${match.slug}`
      // textContent (not innerHTML) so headword text can never inject markup.
      a.textContent = match.headword
      a.setAttribute("role", "option")
      a.setAttribute("data-no-popover", "true")
      li.appendChild(a)
      results.appendChild(li)
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
    const prefix: HeadwordEntry[] = []
    const substring: HeadwordEntry[] = []
    for (const entry of entries) {
      const idx = entry.key.indexOf(query)
      if (idx === 0) prefix.push(entry)
      else if (idx > 0) substring.push(entry)
      if (prefix.length >= MAX_RESULTS) break
    }
    render(prefix.concat(substring).slice(0, MAX_RESULTS))
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

function setupGlossarySearch() {
  // Bundled into the site-wide postscript, so this runs on every page/nav — but
  // the boxes only exist on the glossary page. querySelectorAll handles 0, 1
  // (desktop OR mobile) or 2 instances; each is wired independently.
  document.querySelectorAll(".glossary-search").forEach(setupContainer)
}

document.addEventListener("nav", () => {
  setupGlossarySearch()
})
