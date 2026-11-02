import { Root } from "mdast"

import { QuartzComponentProps } from "../quartz/components/types"
import { QuartzTransformerPlugin } from "../quartz/plugins/types"
import { QuartzPluginData } from "../quartz/plugins/vfile"
import { applyGlossaryTransforms, GLOSSARY_SLUG } from "./glossary-transforms"

export { GLOSSARY_SLUG }

export function isGlossary(page: Pick<QuartzComponentProps, "fileData">): boolean {
  return page.fileData.slug === GLOSSARY_SLUG
}

// The glossary publishes its headword index onto its own file data; reading it
// here keeps every "N terms" badge honest without a second source of truth.
export function glossaryTermCount(files: QuartzPluginData[]): number | undefined {
  const headwords = files.find((file) => file.slug === GLOSSARY_SLUG)?.glossaryHeadwords
  return headwords
    ? new Set(headwords.map((entry) => entry.headword.normalize("NFC"))).size
    : undefined
}

export const DhammaGlossary: QuartzTransformerPlugin = () => ({
  name: "DhammaGlossary",
  markdownPlugins() {
    return [
      () => {
        return (tree: Root, file) => {
          applyGlossaryTransforms(
            tree,
            {
              slug: (file.data.slug as string | undefined) ?? "",
              emitPandocAnchors: false,
            },
            file,
          )
        }
      },
    ]
  },
})
