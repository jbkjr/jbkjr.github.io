import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"

const GlossaryTOC: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  if (!fileData.toc || fileData.toc.length === 0) return null

  return (
    <details class="glossary-inline-toc">
      <summary>{i18n(cfg.locale).components.tableOfContents.title}</summary>
      <ol>
        {fileData.toc.map((entry) => (
          <li key={entry.slug} class={`depth-${entry.depth}`}>
            <a href={`#${entry.slug}`} data-no-popover={true}>
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  )
}

export default (() => GlossaryTOC) satisfies QuartzComponentConstructor
