import { Date, getDate } from "../../quartz/components/Date"
import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

const GlossaryMeta: QuartzComponent = ({ cfg, displayClass, fileData }: QuartzComponentProps) => {
  if (!fileData.dates) return null
  const date = getDate(cfg, fileData)
  if (!date) return null

  return (
    <p class={classNames(displayClass, "content-meta")}>
      Last updated <Date date={date} locale={cfg.locale} />
    </p>
  )
}

export default (() => GlossaryMeta) satisfies QuartzComponentConstructor
