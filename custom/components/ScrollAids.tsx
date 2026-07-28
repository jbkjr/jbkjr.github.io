import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
// @ts-expect-error — esbuild resolves .inline bundles; TS has no module for them
import script from "./scripts/scroll-aids.inline"

// Site-wide scroll chrome: a hairline reading-progress bar along the top edge
// and a floating back-to-top button. The inline script disables both on pages
// too short to need them; both elements are position: fixed, so where this
// renders in the layout doesn't matter.
const ScrollAids: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <div class="scroll-aids">
      <div
        class="reading-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <div class="reading-progress-bar"></div>
      </div>
      <button type="button" class="back-to-top" aria-label="Scroll back to top" title="Back to top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

ScrollAids.afterDOMLoaded = script

export default (() => ScrollAids) satisfies QuartzComponentConstructor
