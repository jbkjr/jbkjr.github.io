import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
// @ts-ignore
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
      <div class="glossary-search-label">Glossary Search</div>
      <input
        class="glossary-search-bar"
        type="text"
        autocomplete="off"
        spellcheck={false}
        placeholder="Search glossary…"
        aria-label="Search glossary terms"
      />
      <ul class="glossary-search-results" role="listbox"></ul>
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
