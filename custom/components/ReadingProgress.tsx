import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
// @ts-expect-error — esbuild resolves .inline bundles; TS has no module for them
import script from "./scripts/reading-progress.inline"

const ReadingProgress: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
  <div
    class={classNames(displayClass, "reading-progress")}
    role="progressbar"
    aria-label="Reading progress"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={0}
  >
    <div class="reading-progress-fill"></div>
  </div>
)

ReadingProgress.afterDOMLoaded = script

export default (() => ReadingProgress) satisfies QuartzComponentConstructor
