import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
// @ts-expect-error — esbuild resolves .inline bundles; TS has no module for them
import script from "./scripts/glossary-search.inline"

const GlossarySearch: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const headwords = fileData.glossaryHeadwords
  if (!headwords || headwords.length === 0) return null

  // Embed the headword index for the client script. Escape "<" so a headword can
  // never break out of the <script> element (defensive — Pali terms contain none).
  const payload = JSON.stringify(headwords).replace(/</g, "\\u003c")

  // Class-based selectors (not ids) so the desktop and mobile instances can both
  // exist in the DOM without colliding; the inline script scopes within each.
  return (
    <div class={classNames(displayClass, "glossary-search")}>
      <div class="glossary-search-label">
        Glossary Search
        <span class="glossary-search-tools">
          <span class="glossary-search-count">{headwords.length} terms</span>
          <button type="button" class="glossary-random" title="Jump to a random entry">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.2" cy="8.2" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="15.8" cy="8.2" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="8.2" cy="15.8" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="15.8" cy="15.8" r="1.6" fill="currentColor" stroke="none" />
            </svg>
            random
          </button>
        </span>
      </div>
      <input
        class="glossary-search-bar"
        type="text"
        autocomplete="off"
        spellcheck={false}
        placeholder="Pāli term or English gloss…"
        aria-label="Search glossary terms and glosses"
      />
      <ul class="glossary-search-results" role="listbox"></ul>
      <p class="glossary-search-empty" hidden>
        No match. Try an English gloss — “craving”, “composure”, “emptiness”.
      </p>
      <script
        type="application/json"
        class="glossary-headword-index"
        dangerouslySetInnerHTML={{ __html: payload }}
      />
    </div>
  )
}

GlossarySearch.afterDOMLoaded = script

export default (() => GlossarySearch) satisfies QuartzComponentConstructor
